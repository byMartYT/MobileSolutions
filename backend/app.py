from fastapi import FastAPI
from fastapi.routing import APIRouter

app = FastAPI()

api_router = APIRouter(prefix="/api/v1")

@api_router.get("/")
def read_root():
    return {"message": "Hello, World!"}

@api_router.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

app.include_router(api_router)