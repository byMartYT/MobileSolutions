from pydantic import BaseModel
from typing import List, Dict, Any, Literal, Optional
from datetime import datetime

class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: datetime

class ConversationContext(BaseModel):
    domain: Optional[str] = None
    goals: List[str] = []
    difficulty: Optional[Literal["beginner", "intermediate", "advanced"]] = None
    timeframe: Optional[str] = None
    preferences: Dict[str, Any] = {}
    collected_info: Dict[str, Any] = {}

class ConversationState(BaseModel):
    id: str
    state: Literal[
        "idle",
        "collecting_domain", 
        "collecting_goals",
        "collecting_difficulty",
        "collecting_timeframe", 
        "collecting_preferences",
        "generating",
        "reviewing",
        "complete"
    ]
    context: ConversationContext
    messages: List[Message]
    is_complete: bool = False
    created_at: datetime
    updated_at: datetime

class MessageRequest(BaseModel):
    conversation_id: str
    message: str

class ConversationResponse(BaseModel):
    conversation_id: str
    message: str
    state: str
    is_complete: bool
    next_question: Optional[str] = None
    progress_percentage: int

class SkillGenerationRequest(BaseModel):
    conversation_id: str

class GeneratedSkill(BaseModel):
    title: str
    goal: str
    color: str
    icon: str
    user: str = "default-user"
    textColor: str = "#FFFFFF"
    tip: str
    todos: List[Dict[str, Any]]

class SkillGenerationResponse(BaseModel):
    success: bool
    skill: Optional[GeneratedSkill] = None
    error: Optional[str] = None
