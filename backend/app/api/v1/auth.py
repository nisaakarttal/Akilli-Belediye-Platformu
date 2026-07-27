"""Kimlik doğrulama uç noktaları: kayıt, giriş, token yenileme, şifre sıfırlama."""

import os
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import gecerli_kullanicial
from app.core.database import get_db
from app.core.limiter import limiter
from app.core.security import (
    erisim_tokeni_olustur,
    sifre_dogrula,
    sifre_hashle,
    sifre_sifirlama_tokeni_olustur,
    tokeni_coz,
    yenileme_tokeni_olustur,
)
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
from app.services.eposta_servisi import (
    hos_geldin_epostasi_gonder,
    sifre_sifirlama_epostasi_gonder,
)


FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000"
)


router = APIRouter()


@router.post(
    "/kayit",
    response_model=TokenYaniti,
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
            .filter(Kullanici.tc_kimlik_no == istek.tc_kimlik_no)
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
    )


    db.add(yeni_kullanici)
    db.commit()
    db.refresh(yeni_kullanici)


    hos_geldin_epostasi_gonder(
        yeni_kullanici.e_posta,
        yeni_kullanici.ad
    )


    return _token_yaniti_olustur(yeni_kullanici)



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

        # Kullanıcı keşfini engellemek için
        # aynı maliyetli hash işlemi çalıştırılır.
        sifre_dogrula(
            istek.sifre,
            "$2b$12$LQv3c1yK8W9Xk9M6x2w5Xe6Z8z7s0m5k2n9q"
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

        kalan = int(
            (
                kullanici.hesap_kilit_bitis - simdi
            ).total_seconds() / 60
        )


        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail=f"Hesabınız geçici olarak kilitlendi. {kalan} dakika sonra tekrar deneyiniz."
        )


    if kullanici.hesap_kilit_bitis:

        kullanici.hesap_kilit_bitis = None
        kullanici.basarisiz_giris_sayisi = 0



    if not sifre_dogrula(
        istek.sifre,
        kullanici.sifre_hash
    ):

        kullanici.basarisiz_giris_sayisi += 1


        if kullanici.basarisiz_giris_sayisi >= 5:

            kullanici.hesap_kilit_bitis = (
                simdi + timedelta(minutes=15)
            )


        db.commit()


        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-posta veya şifre hatalı."
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


    return _token_yaniti_olustur(kullanici)



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
            status_code=401,
            detail="Yenileme tokeni geçersiz."
        )


    kullanici = (
        db.query(Kullanici)
        .filter(Kullanici.id == payload.get("sub"))
        .first()
    )


    if kullanici is None or not kullanici.aktif_mi:

        raise HTTPException(
            status_code=401,
            detail="Kullanıcı bulunamadı."
        )


    return _token_yaniti_olustur(kullanici)



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



@router.get("/ben", response_model=KullaniciYaniti)
def hesabim(
    kullanici: Kullanici = Depends(gecerli_kullanicial)
):
    return kullanici



def _token_yaniti_olustur(
    kullanici: Kullanici
) -> TokenYaniti:

    veri = {
        "sub": str(kullanici.id),
        "rol": kullanici.rol.value
    }


    return TokenYaniti(
        erisim_tokeni=erisim_tokeni_olustur(veri),
        yenileme_tokeni=yenileme_tokeni_olustur(veri),
        kullanici=KullaniciYaniti.model_validate(kullanici),
    )