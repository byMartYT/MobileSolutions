from database import client
from models.todo import todo_schema


async def setup_database():
    """
    Setup database collections with validation schemas
    """
    db = client.get_database()
    
    # Check if todos collection exists
    collection_names = await db.list_collection_names()
    
    if "todos" not in collection_names:
        # Create todos collection with validation schema
        await db.create_collection("todos", validator=todo_schema)
        print("Created todos collection with validation schema")
    else:
        # Update existing collection with the schema
        await db.command({
            "collMod": "todos",
            "validator": todo_schema
        })
        print("Updated todos collection validation schema")
        
    # Create indexes if needed
    await db.skills.create_index("title")
