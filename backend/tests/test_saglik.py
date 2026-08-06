"""Sistem sağlık kontrolü ve API sürümleme testleri."""


def test_kok_endpoint(istemci):
    yanit = istemci.get("/")
    assert yanit.status_code == 200
    assert "mesaj" in yanit.json()


def test_saglik_kontrolu_v1(istemci):
    yanit = istemci.get("/api/v1/saglik")
    assert yanit.status_code == 200
    assert yanit.json() == {"durum": "saglikli", "surum": "v1"}


def test_saglik_kontrolu_v2(istemci):
    yanit = istemci.get("/api/v2/saglik")
    assert yanit.status_code == 200
    assert yanit.json() == {"durum": "saglikli", "surum": "v2"}
