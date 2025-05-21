from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.database import Database
import os

# MongoDB connection
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/skills")
client = AsyncIOMotorClient(mongo_uri)
db = client.get_database()

# Database getter
async def get_database() -> Database:
    return db
