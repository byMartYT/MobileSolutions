from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from pymongo.database import Database
from bson import ObjectId
from bson.errors import InvalidId
from database import get_database
from models.todo import Todo, TodoItem, TodoPatch, TodoItemPatch
from models.gamification import PointsReason, UserStatsUpdate

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


async def award_points_for_todo_completion(db: Database, user_id: str, todo_id: str, points: int = 10):
    """Award points when a todo item is completed."""
    try:
        # Import here to avoid circular imports
        from routers.gamification import add_points
        await add_points(user_id, points, PointsReason.TODO_COMPLETED, todo_id, db)
    except Exception as e:
        # Log error but don't fail the main operation
        print(f"Error awarding points: {e}")


async def award_points_for_skill_completion(db: Database, user_id: str, skill_id: str):
    """Award points when a skill is completed (all todos done)."""
    try:
        # Import here to avoid circular imports
        from routers.gamification import add_points, update_user_stats
        
        # Check if skill is actually completed
        skill = await db.skills.find_one({"_id": ObjectId(skill_id)})
        if skill:
            completed_todos = sum(1 for todo in skill.get('todos', []) if todo.get('status'))
            total_todos = len(skill.get('todos', []))
            
            if completed_todos == total_todos and total_todos > 0:
                # Skill completed - award bonus points
                bonus_points = 25 + (total_todos * 5)  # Base 25 + 5 per todo
                await add_points(user_id, bonus_points, PointsReason.SKILL_COMPLETED, skill_id, db)
                
                # Update skill completion stats
                update = UserStatsUpdate(skills_completed=1, update_streak=True)
                await update_user_stats(user_id, update, db)
    except Exception as e:
        print(f"Error awarding skill completion points: {e}")


async def update_user_activity(db: Database, user_id: str):
    """Update user activity for streak tracking."""
    try:
        # Import here to avoid circular imports
        from routers.gamification import update_user_stats
        update = UserStatsUpdate(update_streak=True)
        await update_user_stats(user_id, update, db)
    except Exception as e:
        print(f"Error updating user activity: {e}")


@router.post("/", response_model=Todo, status_code=status.HTTP_201_CREATED)
async def create_todo(todo: Todo, db: Database = Depends(get_database)):
    """Create a new todo list"""
    # Convert to dict for MongoDB
    todo_dict = todo.model_dump(exclude={"id"})
    
    # Insert into database
    result = await db.skills.insert_one(todo_dict)
    
    # Gamification: Update user activity for creating a skill
    user_id = todo.user
    if user_id:
        await update_user_activity(db, user_id)
    
    # Return created todo with ID
    created_todo = await db.skills.find_one({"_id": result.inserted_id})
    return parse_todo(created_todo)


@router.get("/", response_model=List[Todo])
async def get_todos(skip: int = 0, limit: int = 10, db: Database = Depends(get_database)):
    """Get all todo lists with pagination"""
    todos = []
    cursor = db.skills.find().skip(skip).limit(limit)
    
    async for todo in cursor:
        todos.append(parse_todo(todo))
        
    return todos


@router.get("/{todo_id}", response_model=Todo)
async def get_todo(todo_id: str, db: Database = Depends(get_database)):
    """Get a specific todo list by ID"""
    try:
        todo = await db.skills.find_one({"_id": ObjectId(todo_id)})
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
        existing = await db.skills.find_one({"_id": ObjectId(todo_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Todo not found")
            
        # Update the todo
        todo_dict = todo.dict(exclude={"id"})
        await db.skills.update_one(
            {"_id": ObjectId(todo_id)},
            {"$set": todo_dict}
        )
        
        # Return updated todo
        updated_todo = await db.skills.find_one({"_id": ObjectId(todo_id)})
        return parse_todo(updated_todo)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid todo ID format")


@router.patch("/{todo_id}", response_model=Todo)
async def partial_update_todo(todo_id: str, todo_update: TodoPatch, db: Database = Depends(get_database)):
    """Partially update a todo list by ID - only update the fields that are provided"""
    try:
        # Check if todo exists
        existing = await db.skills.find_one({"_id": ObjectId(todo_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        # Convert update data to dict and remove None values
        update_data = {k: v for k, v in todo_update.dict().items() if v is not None}
        
        if not update_data:
            # If no fields to update, just return the existing todo
            return parse_todo(existing)
            
        # Update the todo with only the provided fields
        await db.skills.update_one(
            {"_id": ObjectId(todo_id)},
            {"$set": update_data}
        )
        
        # Return updated todo
        updated_todo = await db.skills.find_one({"_id": ObjectId(todo_id)})
        return parse_todo(updated_todo)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid todo ID format")


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: str, db: Database = Depends(get_database)):
    """Delete a todo list by ID"""
    try:
        # Check if todo exists
        todo = await db.skills.find_one({"_id": ObjectId(todo_id)})
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
            
        # Delete the todo
        await db.skills.delete_one({"_id": ObjectId(todo_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid todo ID format")


@router.patch("/{todo_id}/items/{item_id}", response_model=Todo)
async def update_todo_item(
    todo_id: str, 
    item_id: str, 
    item_update: TodoItemPatch, 
    db: Database = Depends(get_database)
):
    """Update a specific todo item within a todo list"""
    try:
        # Überprüfen, ob die Todo-Liste existiert
        todo = await db.skills.find_one({"_id": ObjectId(todo_id)})
        if not todo:
            raise HTTPException(status_code=404, detail="Todo list not found")
        
        # Konvertiere Update-Daten zu Dict und entferne None-Werte
        update_data = {k: v for k, v in item_update.dict().items() if v is not None}
        
        if not update_data:
            # Wenn keine Felder zum Aktualisieren vorhanden sind,
            # geben wir die unveränderte Todo-Liste zurück
            return parse_todo(todo)
        
        # Finde den Index des zu aktualisierenden Todo-Items
        item_index = None
        old_status = None
        for i, item in enumerate(todo['todos']):
            if item['id'] == item_id:
                item_index = i
                old_status = item.get('status', False)
                break
        
        if item_index is None:
            raise HTTPException(status_code=404, detail="Todo item not found")
            
        # Aktualisiere die Felder des spezifischen Todo-Items
        update_path = f"todos.{item_index}"
        await db.skills.update_one(
            {"_id": ObjectId(todo_id)},
            {"$set": {f"{update_path}.{key}": value for key, value in update_data.items()}}
        )
        
        # Gamification: Check if todo item was completed
        new_status = update_data.get('status')
        if new_status is not None and new_status != old_status:
            user_id = todo.get('user')
            if user_id and new_status:  # Todo was completed
                # Award points for completing todo
                await award_points_for_todo_completion(db, user_id, todo_id)
                
                # Update todo completion stats
                from routers.gamification import update_user_stats
                update_stats = UserStatsUpdate(todos_completed=1, update_streak=True)
                await update_user_stats(user_id, update_stats, db)
                
                # Check if skill is now completed
                await award_points_for_skill_completion(db, user_id, todo_id)
            elif user_id:
                # User was active, update streak
                await update_user_activity(db, user_id)
        
        # Gib die aktualisierte Todo-Liste zurück
        updated_todo = await db.skills.find_one({"_id": ObjectId(todo_id)})
        return parse_todo(updated_todo)
        
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")