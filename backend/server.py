from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager
from pathlib import Path
import os
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
import uuid

ROOT_DIR = Path(__file__).parent

# MongoDB
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_SECRET = os.environ.get("JWT_SECRET", "kalam-super-secret-key-change-in-prod")
JWT_ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ── Auth Helpers ──────────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id, "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = auth_header[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        return {"id": payload["sub"], "email": payload["email"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ── Pydantic Models ───────────────────────────────────────────────────────────
class AdminLogin(BaseModel):
    email: str
    password: str

class ProductCreate(BaseModel):
    title: str
    description: str
    price: float
    image_url: str
    category: str = "colouring-book"
    age_range: str = "3-10 years"
    pages_count: int = 48
    is_active: bool = True

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    age_range: Optional[str] = None
    pages_count: Optional[int] = None
    is_active: Optional[bool] = None

class OrderItem(BaseModel):
    product_id: str
    product_title: str
    product_image: str
    price: float
    quantity: int

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_address: str
    city: str
    pincode: str
    items: List[OrderItem]
    total_amount: float
    notes: Optional[str] = ""

class OrderStatusUpdate(BaseModel):
    status: str


# ── Seeding ───────────────────────────────────────────────────────────────────
SAMPLE_PRODUCTS = [
    {
        "id": str(uuid.uuid4()), "title": "Jungle To-Do Colouring Book",
        "description": "Explore the wild jungle! 48 pages of animals, trees and jungle scenes to colour. Perfect for young explorers aged 4–8.",
        "price": 299.0,
        "image_url": "https://static.prod-images.emergentagent.com/jobs/cd5f40a9-651f-4209-9bc2-941d75259399/images/10666c02c5ff6dc3e38051b2a564e4775eaac646994a1ec8b6255159114be80b.png",
        "category": "colouring-book", "age_range": "4-8 years", "pages_count": 48, "is_active": True
    },
    {
        "id": str(uuid.uuid4()), "title": "Space Adventures To-Do Book",
        "description": "Blast off with astronauts, rockets and planets! 64 pages combining colouring with fun space tasks for young astronomers.",
        "price": 349.0,
        "image_url": "https://static.prod-images.emergentagent.com/jobs/cd5f40a9-651f-4209-9bc2-941d75259399/images/7d777bedd0731939b82fa71f254874306cff1316dab1376bf10242b89d45bc94.png",
        "category": "colouring-book", "age_range": "5-10 years", "pages_count": 64, "is_active": True
    },
    {
        "id": str(uuid.uuid4()), "title": "Dinosaur Friends To-Do Book",
        "description": "Travel back in time with T-Rex and friends! 48 pages of dino scenes and activities. A must-have for every dino lover!",
        "price": 299.0,
        "image_url": "https://static.prod-images.emergentagent.com/jobs/cd5f40a9-651f-4209-9bc2-941d75259399/images/ec0440a7a1c265d030e2b55a3b179e45314ee80b5efd702bd9cab1209f3ddc87.png",
        "category": "colouring-book", "age_range": "3-7 years", "pages_count": 48, "is_active": True
    },
    {
        "id": str(uuid.uuid4()), "title": "Magical Forest To-Do Book",
        "description": "Enter a world of fairies and unicorns! 64 pages of whimsical illustrations with creative tasks to spark imagination.",
        "price": 349.0,
        "image_url": "https://images.unsplash.com/photo-1612539466809-8be5e4e01256?w=400&q=80",
        "category": "colouring-book", "age_range": "4-9 years", "pages_count": 64, "is_active": True
    },
    {
        "id": str(uuid.uuid4()), "title": "Ocean Wonders To-Do Book",
        "description": "Dive deep with colourful fish, dolphins and coral reefs! 48 pages of underwater adventures with sea-themed activities.",
        "price": 299.0,
        "image_url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
        "category": "colouring-book", "age_range": "3-8 years", "pages_count": 48, "is_active": True
    },
    {
        "id": str(uuid.uuid4()), "title": "Animals & Nature To-Do Book",
        "description": "From lions to butterflies — 96 pages of detailed animals and nature scenes. Perfect for curious young minds who love the natural world.",
        "price": 399.0,
        "image_url": "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&q=80",
        "category": "colouring-book", "age_range": "6-12 years", "pages_count": 96, "is_active": True
    },
]

async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@kalambooks.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Kalam@2024")
    existing = await db.admins.find_one({"email": admin_email})
    if existing is None:
        await db.admins.insert_one({
            "id": str(uuid.uuid4()), "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Kalam Admin", "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin seeded: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.admins.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info("Admin password refreshed")

async def seed_products():
    count = await db.products.count_documents({})
    if count > 0:
        return
    now = datetime.now(timezone.utc).isoformat()
    docs = [{**p, "created_at": now} for p in SAMPLE_PRODUCTS]
    await db.products.insert_many(docs)
    logger.info(f"Seeded {len(docs)} products")


# ── App Lifespan ──────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed_admin()
    await seed_products()
    yield
    client.close()


app = FastAPI(title="Kalam Shop API", lifespan=lifespan)
api_router = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Auth Routes ───────────────────────────────────────────────────────────────
@api_router.post("/auth/login")
async def admin_login(data: AdminLogin):
    admin = await db.admins.find_one({"email": data.email.lower()})
    if not admin or not verify_password(data.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(admin.get("id", str(admin["_id"])), admin["email"])
    return {"token": token, "email": admin["email"], "name": admin.get("name", "Admin")}

@api_router.get("/auth/me")
async def get_me(admin=Depends(get_current_admin)):
    return admin


# ── Product Routes ────────────────────────────────────────────────────────────
@api_router.get("/products")
async def get_products():
    products = await db.products.find({"is_active": True}, {"_id": 0}).to_list(200)
    return products

@api_router.get("/products/all")
async def get_all_products(admin=Depends(get_current_admin)):
    products = await db.products.find({}, {"_id": 0}).to_list(200)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products")
async def create_product(data: ProductCreate, admin=Depends(get_current_admin)):
    product = {
        "id": str(uuid.uuid4()), **data.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.products.insert_one(product)
    product.pop("_id", None)
    return product

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, data: ProductUpdate, admin=Depends(get_current_admin)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.products.update_one({"id": product_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return await db.products.find_one({"id": product_id}, {"_id": 0})

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin=Depends(get_current_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}


# ── Order Routes ──────────────────────────────────────────────────────────────
@api_router.post("/orders")
async def create_order(data: OrderCreate):
    order_count = await db.orders.count_documents({})
    order_number = f"KLM-{str(order_count + 1001).zfill(4)}"
    order = {
        "id": str(uuid.uuid4()), "order_number": order_number,
        "payment_method": "cod", **data.model_dump(),
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.orders.insert_one(order)
    order.pop("_id", None)
    return order

@api_router.get("/orders")
async def get_orders(admin=Depends(get_current_admin)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return orders

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one(
        {"$or": [{"id": order_id}, {"order_number": order_id}]}, {"_id": 0}
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@api_router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, data: OrderStatusUpdate, admin=Depends(get_current_admin)):
    valid = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if data.status not in valid:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {', '.join(valid)}")
    result = await db.orders.update_one({"id": order_id}, {"$set": {"status": data.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Status updated", "status": data.status}


app.include_router(api_router)
