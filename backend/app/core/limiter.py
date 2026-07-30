from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request

from app.core.security import tokeni_coz


def kullanici_veya_ip_anahtari(request: Request) -> str:
    """
    Rate limit anahtarını mümkünse giriş yapmış kullanıcının kimliğine göre
    (kullanıcı bazlı), aksi halde istemci IP adresine göre (IP bazlı) üretir.
    """
    yetki_basligi = request.headers.get("authorization", "")
    if yetki_basligi.lower().startswith("bearer "):
        payload = tokeni_coz(yetki_basligi[7:])
        if payload and payload.get("sub"):
            return f"kullanici:{payload['sub']}"
    return get_remote_address(request)


# Genel amaçlı, IP bazlı limitleyici (varsayılan: dakikada 200 istek).
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200/minute"]
)

# Kimlik doğrulaması gerektiren hassas uç noktalar için kullanıcı bazlı
# (kullanıcı bulunamazsa IP bazlı) limitleyici.
kullanici_limiter = Limiter(key_func=kullanici_veya_ip_anahtari)