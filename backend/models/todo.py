from typing import List, Optional
from pydantic import BaseModel, Field


class TodoItem(BaseModel):
    """
    Todo item model representing individual tasks within a Todo list.
    """
    status: bool = Field(..., description="Status of the todo item (completed or not)")
    text: str = Field(..., description="Content text of the todo item")
    id: str = Field(..., description="Id")



class Todo(BaseModel):
    """
    Todo model representing a collection of todo items with associated metadata.
    """
    title: str = Field(..., description="Title of the todo collection")
    user: str = Field(..., description="User ID associated with the todo")
    icon: str = Field(..., description="Icon identifier for the todo")
    color: str = Field(..., description="Color code for styling the todo")
    textColor: str = Field(..., description="Text color code for styling")
    tip: str = Field(..., description="Helpful tip or description")
    goal: str = Field(..., description="Goal or objective of the todo collection")
    todos: List[TodoItem] = Field(..., description="List of todo items")
    
    # Optional fields not in schema but useful for database
    id: Optional[str] = Field(None, description="MongoDB object ID")
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Fitness Goals",
                "user": "martin",
                "icon": "dumbbell",
                "color": "#4CAF50",
                "textColor": "#FFFFFF",
                "tip": "Stay consistent with your workout routine",
                "goal": "Exercise 3 times per week",
                "todos": [
                    {
                        "status": False,
                        "text": "30 minutes cardio"
                    },
                    {
                        "status": True,
                        "text": "Weight training"
                    }
                ]
            }
        }


class TodoPatch(BaseModel):
    """
    Todo patch model for partial updates of todo items.
    All fields are optional to allow for partial updates.
    """
    title: Optional[str] = Field(None, description="Title of the todo collection")
    user: Optional[str] = Field(None, description="User ID associated with the todo")
    icon: Optional[str] = Field(None, description="Icon identifier for the todo")
    color: Optional[str] = Field(None, description="Color code for styling the todo")
    textColor: Optional[str] = Field(None, description="Text color code for styling")
    tip: Optional[str] = Field(None, description="Helpful tip or description")
    goal: Optional[str] = Field(None, description="Goal or objective of the todo collection")
    todos: Optional[List[TodoItem]] = Field(None, description="List of todo items")

class TodoItemPatch(BaseModel):
    text: str = None
    status: bool = None

# MongoDB Schema Validation
todo_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["title", "icon", "color", "textColor", "tip", "goal", "todos", "user"],
        "properties": {
            "title": {
                "bsonType": "string",
                "description": "Title must be a string and is required."
            },
            "user": {
              "bsonType": "string",
              "description": "User ID must be a string and is required.." 
            },
            "icon": {
                "bsonType": "string",
                "description": "Icon must be a string and is required."
            },
            "color": {
                "bsonType": "string",
                "description": "Color must be a string and is required."
            },
            "textColor": {
                "bsonType": "string",
                "description": "Text color must be a string and is required."
            },
            "tip": {
                "bsonType": "string",
                "description": "Tip must be a string and is required."
            },
            "goal": {
                "bsonType": "string",
                "description": "Goal must be a string and is required."
            },
            "todos": {
                "bsonType": "array",
                "description": "Todos must be an array of objects.",
                "items": {
                    "bsonType": "object",
                    "required": ["status", "text"],
                    "properties": {
                        "status": {
                            "bsonType": "bool",
                            "description": "Status must be a boolean."
                        },
                        "text": {
                            "bsonType": "string",
                            "description": "Text must be a string."
                        }
                    }
                }
            }
        }
    }
}
