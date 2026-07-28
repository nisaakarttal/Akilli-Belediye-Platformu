"""Kimlik doğrulama uç noktaları: kayıt, giriş, token yenileme, şifre sıfırlama."""

import os
from datetime import datetime, timezone, timedelta
from app.models.login_log import LoginLog
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.models.refresh_token import RefreshToken
from app.api.deps import gecerli_kullanicial
from app.core.database import get_db
from app.core.limiter import limiter

import math
from app.core.config import get_settings
from app.models.kullanici import Kullanici
from app.schemas.kullanici import (
    KullaniciGirisIstegi,
    KullaniciKayitIstegi,
    KullaniciYaniti,
    SifremiUnuttumIstegi,
    SifreSifirlaIstegi,
    TokenYaniti,
    YenilemeIstegi,
)
from app.schemas.ortak import MesajYaniti

from app.core.security import (
    erisim_tokeni_olustur,
    sifre_dogrula,
    sifre_hashle,
    sifre_sifirlama_tokeni_olustur,
    tokeni_coz,
    yenileme_tokeni_olustur,
    token_hashle,
    email_dogrulama_tokeni_olustur,
)

from app.services.eposta_servisi import (
    sifre_sifirlama_epostasi_gonder,
    email_dogrulama_epostasi_gonder,

)

ayarlar = get_settings()

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000"
)

DUMMY_PASSWORD_HASH = (
    "$2b$12$.8fCgj0ypi8UJE4TMyCcBOtxRCCsYHza07Yc5jhUxooqqKF3TeNtG"
)


router = APIRouter()

def login_log_kaydet(
    db: Session,
    email: str,
    basarili: bool,
    request: Request,
    kullanici_id=None
):
    log = LoginLog(
        kullanici_id=kullanici_id,
        email=email,
        basarili_mi=basarili,
        ip_adresi=(
            request.client.host
            if request and request.client
            else None
        ),
        kullanici_aracisi=(
            request.headers.get("user-agent")
            if request
            else None
        )
    )

    db.add(log)
    db.commit()

@router.post(
    "/kayit",
    response_model=MesajYaniti,
    status_code=status.HTTP_201_CREATED
)
def kayit_ol(
    istek: KullaniciKayitIstegi,
    db: Session = Depends(get_db)
):
    """Yeni vatandaş hesabı oluşturur."""


    mevcut = (
        db.query(Kullanici)
        .filter(Kullanici.e_posta == istek.e_posta)
        .first()
    )

    if mevcut:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu e-posta adresi ile daha önce kayıt oluşturulmuş."
        )


    if istek.tc_kimlik_no:

        tc_mevcut = (
            db.query(Kullanici)
            .filter(
                Kullanici.tc_kimlik_no == istek.tc_kimlik_no
            )
            .first()
        )

        if tc_mevcut:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Bu T.C. Kimlik No ile daha önce kayıt oluşturulmuş."
            )

    yeni_kullanici = Kullanici(
        ad=istek.ad,
        soyad=istek.soyad,
        e_posta=istek.e_posta,
        telefon=istek.telefon,
        sifre_hash=sifre_hashle(istek.sifre),
        tc_kimlik_no=istek.tc_kimlik_no,
        adres=istek.adres,
        email_dogrulandi=False,
    )


    db.add(yeni_kullanici)
    db.commit()
    db.refresh(yeni_kullanici)


    # Email doğrulama token oluşturma
    email_token = email_dogrulama_tokeni_olustur(
        {
            "sub": str(yeni_kullanici.id)
        }
    )


    dogrulama_linki = (
        f"{FRONTEND_URL}"
        f"/email-dogrula?token={email_token}"
    )


    # Doğrulama maili gönderme
    email_dogrulama_epostasi_gonder(
        yeni_kullanici.e_posta,
        yeni_kullanici.ad,
        dogrulama_linki
    )

    return MesajYaniti(
        mesaj="Kayıt başarılı. Email adresinize doğrulama bağlantısı gönderildi."
    )


@router.post("/giris", response_model=TokenYaniti)
@limiter.limit("5/minute")
def giris_yap(
    request: Request,
    istek: KullaniciGirisIstegi,
    db: Session = Depends(get_db)
):
    """
    Kullanıcı girişi.

    Güvenlik:
    - IP başına 5 istek/dakika
    - 5 yanlış şifre sonrası 15 dakika hesap kilidi
    """

    kullanici = (
        db.query(Kullanici)
        .filter(Kullanici.e_posta == istek.e_posta)
        .first()
    )

    if kullanici is None:
        sifre_dogrula(
            istek.sifre,
            DUMMY_PASSWORD_HASH
        )

        login_log_kaydet(
            db=db,
            email=istek.e_posta,
            basarili=False,
            request=request
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-posta veya şifre hatalı."
        )


    simdi = datetime.now(timezone.utc)


    if (
        kullanici.hesap_kilit_bitis
        and kullanici.hesap_kilit_bitis > simdi
    ):

        kalan = math.ceil(
            (kullanici.hesap_kilit_bitis - simdi).total_seconds() / 60
        )

        login_log_kaydet(
            db=db,
            email=kullanici.e_posta,
            basarili=False,
            request=request,
            kullanici_id=kullanici.id
        )

        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail=f"Hesabınız geçici olarak kilitlendi. {kalan} dakika sonra tekrar deneyiniz."
        )


    if kullanici.hesap_kilit_bitis:

        kullanici.hesap_kilit_bitis = None
        kullanici.basarisiz_giris_sayisi = 0
        db.commit()

    if not sifre_dogrula(
            istek.sifre,
            kullanici.sifre_hash
    ):

        kullanici.basarisiz_giris_sayisi += 1

        login_log_kaydet(
            db=db,
            email=kullanici.e_posta,
            basarili=False,
            request=request,
            kullanici_id=kullanici.id
        )

        if kullanici.basarisiz_giris_sayisi >= 5:
            kullanici.hesap_kilit_bitis = (
                    simdi + timedelta(minutes=15)
            )

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-posta veya şifre hatalı."
        )

    if not kullanici.email_dogrulandi:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Lütfen önce email adresinizi doğrulayınız."
        )

    if not kullanici.aktif_mi:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hesabınız pasif duruma alınmıştır."
        )



    kullanici.basarisiz_giris_sayisi = 0
    kullanici.hesap_kilit_bitis = None
    kullanici.son_giris_tarihi = simdi

    db.commit()

    login_log_kaydet(
        db=db,
        email=kullanici.e_posta,
        basarili=True,
        request=request,
        kullanici_id=kullanici.id
    )

    return _token_yaniti_olustur(
        kullanici,
        db,
        request
    )


@router.post(
    "/giris/form",
    response_model=TokenYaniti,
    include_in_schema=False
)
def giris_yap_form(
    request: Request,
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    istek = KullaniciGirisIstegi(
        e_posta=form.username,
        sifre=form.password
    )


    return giris_yap(
        request,
        istek,
        db
    )


@router.post("/yenile", response_model=TokenYaniti)
def token_yenile(
    request: Request,
    istek: YenilemeIstegi,
    db: Session = Depends(get_db)
):

    payload = tokeni_coz(
        istek.yenileme_tokeni
    )


    if (
        payload is None
        or payload.get("tip") != "yenileme"
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Yenileme tokeni geçersiz."
        )


    # Kullanıcı kontrolü
    kullanici = (
        db.query(Kullanici)
        .filter(
            Kullanici.id == payload.get("sub")
        )
        .first()
    )

    if kullanici is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı bulunamadı."
        )

    if not kullanici.aktif_mi:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hesap aktif değil."
        )


    # Refresh token DB kontrolü
    token_hash =token_hashle(
        istek.yenileme_tokeni
    )


    kayit = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token_hash == token_hash
        )
        .first()
    )


    if kayit is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token bulunamadı."
        )


    if kayit.iptal_edildi:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token iptal edilmiş."
        )


    simdi = datetime.now(timezone.utc)


    if kayit.son_kullanma_tarihi < simdi:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token süresi dolmuş."
        )


    # Eski refresh token iptal edilir
    kayit.iptal_edildi = True

    db.commit()


    return _token_yaniti_olustur(
        kullanici,
        db,
        request
    )


@router.post("/sifremi-unuttum", response_model=MesajYaniti)
@limiter.limit("3/hour")
def sifremi_unuttum(
    request: Request,
    istek: SifremiUnuttumIstegi,
    db: Session = Depends(get_db)
):

    kullanici = (
        db.query(Kullanici)
        .filter(Kullanici.e_posta == istek.e_posta)
        .first()
    )


    if kullanici:

        token = sifre_sifirlama_tokeni_olustur(
            {
                "sub": str(kullanici.id)
            }
        )


        baglanti = (
            f"{FRONTEND_URL}"
            f"/sifre-sifirla?token={token}"
        )


        sifre_sifirlama_epostasi_gonder(
            kullanici.e_posta,
            kullanici.ad,
            baglanti
        )


    return MesajYaniti(
        mesaj="Eğer bu e-posta adresi sistemimizde kayıtlıysa, şifre sıfırlama bağlantısı gönderilmiştir."
    )

@router.post("/sifre-sifirla", response_model=MesajYaniti)
def sifre_sifirla(
    istek: SifreSifirlaIstegi,
    db: Session = Depends(get_db)
):
    """
    Şifre sıfırlama tokeni ile yeni şifre belirler.
    """

    payload = tokeni_coz(istek.token)

    if (
        payload is None
        or payload.get("tip") != "sifre_sifirlama"
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sıfırlama bağlantısı geçersiz veya süresi dolmuş."
        )

    kullanici = (
        db.query(Kullanici)
        .filter(Kullanici.id == payload.get("sub"))
        .first()
    )

    if kullanici is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kullanıcı bulunamadı."
        )

    kullanici.sifre_hash = sifre_hashle(
        istek.yeni_sifre
    )

    # Güvenlik durumunu sıfırla
    kullanici.basarisiz_giris_sayisi = 0
    kullanici.hesap_kilit_bitis = None

    db.commit()

    return MesajYaniti(
        mesaj="Şifreniz başarıyla güncellendi."
    )


@router.get("/ben", response_model=KullaniciYaniti)
def hesabim(
    kullanici: Kullanici = Depends(gecerli_kullanicial)
):
    return kullanici


def _token_yaniti_olustur(
    kullanici: Kullanici,
    db: Session,
    request: Request | None = None,
) -> TokenYaniti:

    veri = {
        "sub": str(kullanici.id),
        "rol": kullanici.rol.value
    }


    erisim_tokeni = erisim_tokeni_olustur(veri)

    refresh_tokeni = yenileme_tokeni_olustur(veri)


    refresh_token_kayit = RefreshToken(
        kullanici_id=kullanici.id,
        token_hash=token_hashle(
            refresh_tokeni
        ),
        son_kullanma_tarihi=(
            datetime.now(timezone.utc)
            + timedelta(
                days=ayarlar.REFRESH_TOKEN_EXPIRE_DAYS
            )
        ),
        ip_adresi=(
            request.client.host
            if request and request.client
            else None
        ),
        kullanici_aracisi=(
            request.headers.get("user-agent")
            if request
            else None
        ),
    )


    db.add(refresh_token_kayit)
    db.commit()
    db.refresh(refresh_token_kayit)


    return TokenYaniti(
        erisim_tokeni=erisim_tokeni,
        yenileme_tokeni=refresh_tokeni,
        kullanici=KullaniciYaniti.model_validate(kullanici),
    )

@router.get(
    "/email-dogrula",
    response_model=MesajYaniti
)
def email_dogrula(
    token: str,
    db: Session = Depends(get_db)
):

    payload = tokeni_coz(token)

    if (
        payload is None
        or payload.get("tip") != "email_dogrulama"
    ):
        raise HTTPException(
            status_code=400,
            detail="Email doğrulama bağlantısı geçersiz."
        )


    kullanici = (
        db.query(Kullanici)
        .filter(
            Kullanici.id == payload.get("sub")
        )
        .first()
    )


    if kullanici is None:
        raise HTTPException(
            status_code=404,
            detail="Kullanıcı bulunamadı."
        )

    if kullanici.email_dogrulandi:
        return MesajYaniti(
            mesaj="Email adresiniz zaten doğrulanmış."
        )

    kullanici.email_dogrulandi = True
    db.commit()


    return MesajYaniti(
        mesaj="Email adresiniz başarıyla doğrulandı."
    )