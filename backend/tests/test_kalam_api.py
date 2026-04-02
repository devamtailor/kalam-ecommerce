"""Backend tests for Kalam Children's Colour Books API"""
import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")

ADMIN_EMAIL = "admin@kalambooks.com"
ADMIN_PASSWORD = "Kalam@2024"


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth(api, token):
    api.headers.update({"Authorization": f"Bearer {token}"})
    return api


# ── Auth ──────────────────────────────────────────────────────────────────────
class TestAuth:
    def test_login_success(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data
        assert data["email"] == ADMIN_EMAIL

    def test_login_wrong_password(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_get_me(self, auth):
        r = auth.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200
        assert "email" in r.json()


# ── Products ──────────────────────────────────────────────────────────────────
class TestProducts:
    created_id = None

    def test_get_products(self, api):
        r = api.get(f"{BASE_URL}/api/products")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 6
        assert "id" in data[0]
        assert "title" in data[0]
        assert "price" in data[0]

    def test_get_single_product(self, api):
        products = api.get(f"{BASE_URL}/api/products").json()
        pid = products[0]["id"]
        r = api.get(f"{BASE_URL}/api/products/{pid}")
        assert r.status_code == 200
        assert r.json()["id"] == pid

    def test_get_product_not_found(self, api):
        r = api.get(f"{BASE_URL}/api/products/nonexistent-id")
        assert r.status_code == 404

    def test_create_product(self, auth):
        payload = {
            "title": "TEST_New Colouring Book",
            "description": "Test description",
            "price": 199.0,
            "image_url": "https://example.com/img.png",
            "category": "colouring-book",
            "age_range": "4-8 years",
            "pages_count": 48,
            "is_active": True
        }
        r = auth.post(f"{BASE_URL}/api/products", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["title"] == payload["title"]
        assert "id" in data
        TestProducts.created_id = data["id"]

    def test_update_product(self, auth):
        pid = TestProducts.created_id
        r = auth.put(f"{BASE_URL}/api/products/{pid}", json={"price": 249.0})
        assert r.status_code == 200
        assert r.json()["price"] == 249.0

    def test_delete_product(self, auth):
        pid = TestProducts.created_id
        r = auth.delete(f"{BASE_URL}/api/products/{pid}")
        assert r.status_code == 200
        # Verify deleted
        r2 = auth.get(f"{BASE_URL}/api/products/{pid}")
        assert r2.status_code == 404

    def test_get_all_products_admin(self, auth):
        r = auth.get(f"{BASE_URL}/api/products/all")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ── Orders ────────────────────────────────────────────────────────────────────
class TestOrders:
    order_id = None

    def test_create_order(self, api):
        products = api.get(f"{BASE_URL}/api/products").json()
        payload = {
            "customer_name": "TEST_Customer",
            "customer_phone": "9876543210",
            "customer_address": "123 Test Street",
            "city": "Mumbai",
            "pincode": "400001",
            "items": [{
                "product_id": products[0]["id"],
                "product_title": products[0]["title"],
                "product_image": products[0]["image_url"],
                "price": products[0]["price"],
                "quantity": 2
            }],
            "total_amount": products[0]["price"] * 2,
            "notes": "Test order"
        }
        r = api.post(f"{BASE_URL}/api/orders", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert "order_number" in data
        assert data["order_number"].startswith("KLM-")
        assert data["status"] == "pending"
        assert "id" in data
        TestOrders.order_id = data["id"]

    def test_get_order_by_id(self, api):
        r = api.get(f"{BASE_URL}/api/orders/{TestOrders.order_id}")
        assert r.status_code == 200
        assert r.json()["id"] == TestOrders.order_id

    def test_get_orders_admin(self, auth):
        r = auth.get(f"{BASE_URL}/api/orders")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_update_order_status(self, auth):
        r = auth.put(f"{BASE_URL}/api/orders/{TestOrders.order_id}/status", json={"status": "processing"})
        assert r.status_code == 200
        assert r.json()["status"] == "processing"

    def test_update_order_status_invalid(self, auth):
        r = auth.put(f"{BASE_URL}/api/orders/{TestOrders.order_id}/status", json={"status": "unknown"})
        assert r.status_code == 400
