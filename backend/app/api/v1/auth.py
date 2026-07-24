"""Kimlik doğrulama uç noktaları: kayıt, giriş, token yenileme, şifre sıfırlama."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import gecerli_kullanicial
from app.core.database import get_db
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
from app.services.eposta_servisi import hos_geldin_epostasi_gonder, sifre_sifirlama_epostasi_gonder

router = APIRouter()


@router.post("/kayit", response_model=TokenYaniti, status_code=status.HTTP_201_CREATED)
def kayit_ol(istek: KullaniciKayitIstegi, db: Session = Depends(get_db)):
    """Yeni bir vatandaş hesabı oluşturur ve doğrudan giriş yapar."""
    mevcut = db.query(Kullanici).filter(Kullanici.e_posta == istek.e_posta).first()
    if mevcut is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu e-posta adresi ile daha önce kayıt oluşturulmuş.",
        )

    if istek.tc_kimlik_no:
        tc_mevcut = db.query(Kullanici).filter(Kullanici.tc_kimlik_no == istek.tc_kimlik_no).first()
        if tc_mevcut is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Bu T.C. Kimlik No ile daha önce kayıt oluşturulmuş.",
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

    hos_geldin_epostasi_gonder(yeni_kullanici.e_posta, yeni_kullanici.ad)

    return _token_yaniti_olustur(yeni_kullanici)


@router.post("/giris", response_model=TokenYaniti)
def giris_yap(istek: KullaniciGirisIstegi, db: Session = Depends(get_db)):
    """E-posta ve şifre ile giriş yapar."""
    kullanici = db.query(Kullanici).filter(Kullanici.e_posta == istek.e_posta).first()

    if kullanici is None or not sifre_dogrula(istek.sifre, kullanici.sifre_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-posta veya şifre hatalı.",
        )

    if not kullanici.aktif_mi:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hesabınız pasif duruma alınmıştır. Lütfen belediye ile iletişime geçin.",
        )

    kullanici.son_giris_tarihi = datetime.now(timezone.utc)
    db.commit()

    return _token_yaniti_olustur(kullanici)


@router.post("/giris/form", response_model=TokenYaniti, include_in_schema=False)
def giris_yap_form(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Swagger UI'daki 'Authorize' kilidinin çalışabilmesi için OAuth2 form
    standardını destekleyen ek giriş uç noktası (e-posta `username` alanına girilir).
    """
    istek = KullaniciGirisIstegi(e_posta=form.username, sifre=form.password)
    return giris_yap(istek, db)


@router.post("/yenile", response_model=TokenYaniti)
def token_yenile(istek: YenilemeIstegi, db: Session = Depends(get_db)):
    """Yenileme tokeni ile yeni bir erişim tokeni üretir."""
    payload = tokeni_coz(istek.yenileme_tokeni)
    if payload is None or payload.get("tip") != "yenileme":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Yenileme tokeni geçersiz veya süresi dolmuş.",
        )

    kullanici = db.query(Kullanici).filter(Kullanici.id == payload.get("sub")).first()
    if kullanici is None or not kullanici.aktif_mi:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Kullanıcı bulunamadı.")

    return _token_yaniti_olustur(kullanici)


@router.post("/sifremi-unuttum", response_model=MesajYaniti)
def sifremi_unuttum(istek: SifremiUnuttumIstegi, db: Session = Depends(get_db)):
    """
    Şifre sıfırlama bağlantısı gönderir. Güvenlik gereği, e-posta sistemde
    kayıtlı olsun ya da olmasın her zaman aynı genel mesaj döndürülür —
    böylece hangi e-postaların sistemde kayıtlı olduğu tahmin edilemez.
    """
    kullanici = db.query(Kullanici).filter(Kullanici.e_posta == istek.e_posta).first()

    if kullanici is not None:
        token = sifre_sifirlama_tokeni_olustur({"sub": str(kullanici.id)})
        baglanti = f"https://kapakli-belediye.gov.tr/sifre-sifirla?token={token}"
        sifre_sifirlama_epostasi_gonder(kullanici.e_posta, kullanici.ad, baglanti)

    return MesajYaniti(
        mesaj="Eğer bu e-posta adresi sistemimizde kayıtlıysa, şifre sıfırlama bağlantısı gönderilmiştir."
    )


@router.post("/sifre-sifirla", response_model=MesajYaniti)
def sifre_sifirla(istek: SifreSifirlaIstegi, db: Session = Depends(get_db)):
    """Sıfırlama tokeni ile yeni şifre belirler."""
    payload = tokeni_coz(istek.token)
    if payload is None or payload.get("tip") != "sifre_sifirlama":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sıfırlama bağlantısının süresi dolmuş veya geçersiz. Lütfen yeniden talep edin.",
        )

    kullanici = db.query(Kullanici).filter(Kullanici.id == payload.get("sub")).first()
    if kullanici is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı.")

    kullanici.sifre_hash = sifre_hashle(istek.yeni_sifre)
    db.commit()

    return MesajYaniti(mesaj="Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.")


@router.get("/ben", response_model=KullaniciYaniti)
def hesabim(kullanici: Kullanici = Depends(gecerli_kullanicial)):
    """Giriş yapmış kullanıcının kendi bilgilerini döner."""
    return kullanici


def _token_yaniti_olustur(kullanici: Kullanici) -> TokenYaniti:
    veri = {"sub": str(kullanici.id), "rol": kullanici.rol.value}
    return TokenYaniti(
        erisim_tokeni=erisim_tokeni_olustur(veri),
        yenileme_tokeni=yenileme_tokeni_olustur(veri),
        kullanici=KullaniciYaniti.model_validate(kullanici),
    )
