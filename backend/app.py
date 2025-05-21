from fastapi import FastAPI, Depends
from fastapi.routing import APIRouter
from pymongo.database import Database
from database import get_database

app = FastAPI(title="MobileSolutions API")

api_router = APIRouter(prefix="/api/v1")

@api_router.get("/")
def read_root():
    return {"message": "Hello, World!"}

@api_router.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@api_router.get("/db-test")
async def db_test(db: Database = Depends(get_database)):
    try:
        # Test MongoDB connection by retrieving server info
        server_info = await db.command("serverStatus")
        return {
            "message": "Successfully connected to MongoDB",
            "version": server_info.get("version")
        }
    except Exception as e:
        return {"error": f"Failed to connect to MongoDB: {str(e)}"}

app.include_router(api_router)