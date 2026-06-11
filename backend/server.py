from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import secrets
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
# Multiple Admin Accounts
ADMINS = [
    {
        "email": "admin@sam.com",
        "password": "Sam@6501"
    },
    {
        "email": "owner@readify.com",
        "password": "Readify@2026"
    },
    {
        "email": "unknown@readify.com",
        "password": "unknown@readify2026"
    },
    {
        "email": "shreyansh@readify.com",
        "password": "shreyansh@readify2026"
    }
]
# Session token regenerated per process start; persistent enough for admin
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', secrets.token_urlsafe(32))

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ============ MODELS ============
class Book(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    author: str
    subject: str
    exam_type: str
    telegram_link: str
    description: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class BookCreate(BaseModel):
    title: str
    author: str
    subject: str
    exam_type: str
    telegram_link: str
    description: str = ""


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    subject: Optional[str] = None
    exam_type: Optional[str] = None
    telegram_link: Optional[str] = None
    description: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    token: str
    email: str


# ============ AUTH ============
def require_admin(x_admin_token: Optional[str] = Header(None)):
    if not x_admin_token or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


# ============ ROUTES ============
@api_router.get("/")
async def root():
    return {"message": "ReadifyBySam API"}

@api_router.post("/admin/login", response_model=LoginResponse)
async def admin_login(payload: LoginRequest):

    email = payload.email.strip().lower()

    for admin in ADMINS:
        if (
            admin["email"].lower() == email
            and admin["password"] == payload.password
        ):
            return LoginResponse(
                token=ADMIN_TOKEN,
                email=admin["email"]
            )

    raise HTTPException(
        status_code=401,
        detail="Invalid email or password"
    )

@api_router.get("/admin/verify")
async def admin_verify(_: bool = Depends(require_admin)):
    return {
        "valid": True,
        "admins": [admin["email"] for admin in ADMINS]
    }


@api_router.get("/books", response_model=List[Book])
async def list_books():
    docs = await db.books.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Book(**d) for d in docs]


@api_router.get("/books/{book_id}", response_model=Book)
async def get_book(book_id: str):
    doc = await db.books.find_one({"id": book_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Book not found")
    return Book(**doc)


@api_router.post("/books", response_model=Book)
async def create_book(payload: BookCreate, _: bool = Depends(require_admin)):
    book = Book(**payload.model_dump())
    await db.books.insert_one(book.model_dump())
    return book


@api_router.put("/books/{book_id}", response_model=Book)
async def update_book(book_id: str, payload: BookUpdate, _: bool = Depends(require_admin)):
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.books.update_one({"id": book_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Book not found")
    doc = await db.books.find_one({"id": book_id}, {"_id": 0})
    return Book(**doc)


@api_router.delete("/books/{book_id}")
async def delete_book(book_id: str, _: bool = Depends(require_admin)):
    result = await db.books.delete_one({"id": book_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"success": True}


@api_router.get("/stats")
async def stats():
    total = await db.books.count_documents({})
    subjects = await db.books.distinct("subject")
    exam_types = await db.books.distinct("exam_type")
    return {
        "total_books": total,
        "subjects": sorted(subjects),
        "exam_types": sorted(exam_types),
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
logger.info(
    f"Admin token initialized ({len(ADMINS)} admin accounts loaded)"
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
