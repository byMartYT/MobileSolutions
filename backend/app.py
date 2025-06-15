from fastapi import FastAPI, Depends
from fastapi.routing import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pymongo.database import Database
from database import get_database
from routers import todo, gamification
from db_setup import setup_database

app = FastAPI(title="MobileSolutions API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api/v1")

@api_router.get("/")
def read_root():
    return {"message": "Welcome to Skills API!"}

@api_router.get("/health")
def health_check():
    return {"status": "healthy"}

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

# Include the todo router
api_router.include_router(todo.router)

# Include the gamification router
api_router.include_router(gamification.router)

# Include the main API router
app.include_router(api_router)

# Event handlers
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await setup_database()