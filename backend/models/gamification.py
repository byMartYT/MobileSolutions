from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class AchievementCategory(str, Enum):
    SKILL = "skill"
    STREAK = "streak"
    GENERAL = "general"
    SPEED = "speed"
    CONSISTENCY = "consistency"


class ConditionType(str, Enum):
    TODO_COUNT = "todo_count"
    SKILL_COUNT = "skill_count"
    STREAK_DAYS = "streak_days"
    POINTS_TOTAL = "points_total"
    SPEED_COMPLETION = "speed_completion"


class PointsReason(str, Enum):
    TODO_COMPLETED = "todo_completed"
    SKILL_COMPLETED = "skill_completed"
    STREAK_BONUS = "streak_bonus"
    ACHIEVEMENT_UNLOCKED = "achievement_unlocked"
    DAILY_LOGIN = "daily_login"


class UserStats(BaseModel):
    """
    User statistics model for gamification system.
    """
    user_id: str = Field(..., description="User ID")
    total_points: int = Field(default=0, description="Total accumulated points")
    current_level: int = Field(default=1, description="Current user level")
    current_level_progress: float = Field(default=0.0, description="Progress to next level (0-100%)")
    streak_count: int = Field(default=0, description="Current consecutive days streak")
    longest_streak: int = Field(default=0, description="Longest streak ever achieved")
    last_active_date: str = Field(default_factory=lambda: datetime.now().isoformat(), description="Last activity date")
    total_skills_completed: int = Field(default=0, description="Total skills completed")
    total_todos_completed: int = Field(default=0, description="Total todos completed")
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat(), description="Creation timestamp")
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat(), description="Last update timestamp")
    
    # Optional fields for database
    id: Optional[str] = Field(None, description="MongoDB object ID")

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "martin",
                "total_points": 1250,
                "current_level": 3,
                "current_level_progress": 75.5,
                "streak_count": 5,
                "longest_streak": 12,
                "last_active_date": "2024-01-15T10:30:00Z",
                "total_skills_completed": 8,
                "total_todos_completed": 45
            }
        }


class Achievement(BaseModel):
    """
    Achievement definition model.
    """
    name: str = Field(..., description="Achievement name")
    description: str = Field(..., description="Achievement description")
    icon: str = Field(..., description="Achievement icon identifier")
    category: AchievementCategory = Field(..., description="Achievement category")
    condition_type: ConditionType = Field(..., description="Type of condition to unlock")
    condition_value: int = Field(..., description="Value needed to unlock")
    points_reward: int = Field(..., description="Points awarded when unlocked")
    is_hidden: bool = Field(default=False, description="Whether achievement is hidden until unlocked")
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat(), description="Creation timestamp")
    
    # Optional fields for database
    id: Optional[str] = Field(None, description="MongoDB object ID")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "First Steps",
                "description": "Complete your first todo item",
                "icon": "trophy",
                "category": "general",
                "condition_type": "todo_count",
                "condition_value": 1,
                "points_reward": 10,
                "is_hidden": False
            }
        }


class UserAchievement(BaseModel):
    """
    User's unlocked achievement model.
    """
    user_id: str = Field(..., description="User ID")
    achievement_id: str = Field(..., description="Achievement ID")
    unlocked_at: str = Field(default_factory=lambda: datetime.now().isoformat(), description="Unlock timestamp")
    is_seen: bool = Field(default=False, description="Whether user has seen the achievement notification")
    
    # Optional fields for database
    id: Optional[str] = Field(None, description="MongoDB object ID")

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "martin",
                "achievement_id": "first_steps_achievement",
                "unlocked_at": "2024-01-15T10:30:00Z",
                "is_seen": True
            }
        }


class PointsEntry(BaseModel):
    """
    Points transaction history model.
    """
    user_id: str = Field(..., description="User ID")
    points: int = Field(..., description="Points awarded (positive) or deducted (negative)")
    reason: PointsReason = Field(..., description="Reason for points change")
    reference_id: Optional[str] = Field(None, description="ID of related object (todo, skill, etc.)")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat(), description="Creation timestamp")
    
    # Optional fields for database
    id: Optional[str] = Field(None, description="MongoDB object ID")

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "martin",
                "points": 25,
                "reason": "todo_completed",
                "reference_id": "todo_123",
                "metadata": {"skill_title": "Morning Routine"},
                "created_at": "2024-01-15T10:30:00Z"
            }
        }


class LevelConfig(BaseModel):
    """
    Level configuration model.
    """
    level: int = Field(..., description="Level number")
    points_required: int = Field(..., description="Total points required to reach this level")
    title: str = Field(..., description="Level title/name")
    rewards: List[str] = Field(default_factory=list, description="Rewards unlocked at this level")
    color: str = Field(default="#4CAF50", description="Level color theme")
    
    # Optional fields for database
    id: Optional[str] = Field(None, description="MongoDB object ID")

    class Config:
        json_schema_extra = {
            "example": {
                "level": 5,
                "points_required": 1000,
                "title": "Skilled Achiever",
                "rewards": ["Custom themes", "Priority support"],
                "color": "#9C27B0"
            }
        }


class UserStatsUpdate(BaseModel):
    """
    Model for updating user stats.
    """
    points_to_add: Optional[int] = Field(None, description="Points to add")
    todos_completed: Optional[int] = Field(None, description="Number of todos completed")
    skills_completed: Optional[int] = Field(None, description="Number of skills completed")
    update_streak: Optional[bool] = Field(None, description="Whether to update streak")


# Response models for API
class UserStatsResponse(UserStats):
    """User stats with calculated fields."""
    points_to_next_level: int = Field(..., description="Points needed for next level")
    next_level_title: str = Field(..., description="Next level title")


class AchievementWithProgress(Achievement):
    """Achievement with user progress."""
    is_unlocked: bool = Field(..., description="Whether user has unlocked this achievement")
    progress: float = Field(..., description="Progress towards unlocking (0-100%)")
    unlocked_at: Optional[str] = Field(None, description="When achievement was unlocked")


class GamificationSummary(BaseModel):
    """
    Summary of user's gamification status.
    """
    stats: UserStatsResponse
    recent_achievements: List[UserAchievement] = Field(..., description="Recently unlocked achievements")
    next_achievements: List[AchievementWithProgress] = Field(..., description="Achievements close to unlocking")
    recent_points: List[PointsEntry] = Field(..., description="Recent points activity")
