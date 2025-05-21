from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from pymongo.database import Database
from bson import ObjectId
from bson.errors import InvalidId
from database import get_database
from models.todo import Todo, TodoItem

router = APIRouter(
    prefix="/todos",
    tags=["todos"],
    responses={404: {"description": "Todo not found"}}
)


# Helper function to convert ObjectId to string in response
def parse_todo(todo):
    if todo:
        todo["id"] = str(todo.pop("_id"))
    return todo


@router.post("/", response_model=Todo, status_code=status.HTTP_201_CREATED)
async def create_todo(todo: Todo, db: Database = Depends(get_database)):
    """Create a new todo list"""
    # Convert to dict for MongoDB
    todo_dict = todo.dict(exclude={"id"})
    
    # Insert into database
    result = await db.todos.insert_one(todo_dict)
    
    # Return created todo with ID
    created_todo = await db.todos.find_one({"_id": result.inserted_id})
    return parse_todo(created_todo)


@router.get("/", response_model=List[Todo])
async def get_todos(skip: int = 0, limit: int = 10, db: Database = Depends(get_database)):
    """Get all todo lists with pagination"""
    todos = []
    cursor = db.todos.find().skip(skip).limit(limit)
    
    async for todo in cursor:
        todos.append(parse_todo(todo))
        
    return todos


@router.get("/{todo_id}", response_model=Todo)
async def get_todo(todo_id: str, db: Database = Depends(get_database)):
    """Get a specific todo list by ID"""
    try:
        todo = await db.todos.find_one({"_id": ObjectId(todo_id)})
        if todo:
            return parse_todo(todo)
        raise HTTPException(status_code=404, detail="Todo not found")
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid todo ID format")


@router.put("/{todo_id}", response_model=Todo)
async def update_todo(todo_id: str, todo: Todo, db: Database = Depends(get_database)):
    """Update a todo list by ID"""
    try:
        # Check if todo exists
        existing = await db.todos.find_one({"_id": ObjectId(todo_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Todo not found")
            
        # Update the todo
        todo_dict = todo.dict(exclude={"id"})
        await db.todos.update_one(
            {"_id": ObjectId(todo_id)},
            {"$set": todo_dict}
        )
        
        # Return updated todo
        updated_todo = await db.todos.find_one({"_id": ObjectId(todo_id)})
        return parse_todo(updated_todo)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid todo ID format")


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: str, db: Database = Depends(get_database)):
    """Delete a todo list by ID"""
    try:
        # Check if todo exists
        todo = await db.todos.find_one({"_id": ObjectId(todo_id)})
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
            
        # Delete the todo
        await db.todos.delete_one({"_id": ObjectId(todo_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid todo ID format")
