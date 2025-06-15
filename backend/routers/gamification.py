from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List, Optional
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime, timedelta
import asyncio

from database import get_database
from models.gamification import (
    UserStats, UserStatsUpdate, UserStatsResponse,
    Achievement, UserAchievement, PointsEntry,
    LevelConfig, GamificationSummary, AchievementWithProgress,
    PointsReason, ConditionType
)

router = APIRouter(prefix="/gamification", tags=["gamification"])

# Default level configurations
DEFAULT_LEVELS = [
    {"level": 1, "points_required": 0, "title": "Newbie", "rewards": ["Getting started!"], "color": "#4CAF50"},
    {"level": 2, "points_required": 100, "title": "Beginner", "rewards": ["First milestone"], "color": "#2196F3"},
    {"level": 3, "points_required": 250, "title": "Learner", "rewards": ["Making progress"], "color": "#FF9800"},
    {"level": 4, "points_required": 500, "title": "Achiever", "rewards": ["Half way there"], "color": "#9C27B0"},
    {"level": 5, "points_required": 1000, "title": "Expert", "rewards": ["Skilled performer"], "color": "#F44336"},
    {"level": 6, "points_required": 2000, "title": "Master", "rewards": ["Mastery unlocked"], "color": "#E91E63"},
    {"level": 7, "points_required": 4000, "title": "Legend", "rewards": ["Legendary status"], "color": "#673AB7"},
    {"level": 8, "points_required": 8000, "title": "Champion", "rewards": ["Champion tier"], "color": "#3F51B5"},
    {"level": 9, "points_required": 15000, "title": "Grandmaster", "rewards": ["Elite status"], "color": "#009688"},
    {"level": 10, "points_required": 30000, "title": "Ultimate", "rewards": ["Ultimate achievement"], "color": "#FF5722"},
]

# Default achievements
DEFAULT_ACHIEVEMENTS = [
    {
        "name": "First Steps",
        "description": "Complete your first todo item",
        "icon": "target",
        "category": "general",
        "condition_type": "todo_count",
        "condition_value": 1,
        "points_reward": 10
    },
    {
        "name": "Getting Started",
        "description": "Complete your first skill",
        "icon": "trophy",
        "category": "skill",
        "condition_type": "skill_count",
        "condition_value": 1,
        "points_reward": 25
    },
    {
        "name": "Consistent",
        "description": "Maintain a 3-day streak",
        "icon": "flame",
        "category": "streak",
        "condition_type": "streak_days",
        "condition_value": 3,
        "points_reward": 50
    },
    {
        "name": "On Fire",
        "description": "Maintain a 7-day streak",
        "icon": "fire",
        "category": "streak",
        "condition_type": "streak_days",
        "condition_value": 7,
        "points_reward": 100
    },
    {
        "name": "Unstoppable",
        "description": "Maintain a 30-day streak",
        "icon": "zap",
        "category": "streak",
        "condition_type": "streak_days",
        "condition_value": 30,
        "points_reward": 500
    },
    {
        "name": "Century Club",
        "description": "Complete 100 todo items",
        "icon": "hundred-points",
        "category": "general",
        "condition_type": "todo_count",
        "condition_value": 100,
        "points_reward": 200
    },
    {
        "name": "Skill Master",
        "description": "Complete 10 skills",
        "icon": "graduation-cap",
        "category": "skill",
        "condition_type": "skill_count",
        "condition_value": 10,
        "points_reward": 300
    },
    {
        "name": "Point Hunter",
        "description": "Earn 1000 total points",
        "icon": "star",
        "category": "general",
        "condition_type": "points_total",
        "condition_value": 1000,
        "points_reward": 100
    }
]


async def init_gamification_data(db: Database):
    """Initialize default levels and achievements if they don't exist."""
    # Initialize levels
    levels_collection = db.get_collection("levels")
    if await levels_collection.count_documents({}) == 0:
        await levels_collection.insert_many(DEFAULT_LEVELS)
    
    # Initialize achievements
    achievements_collection = db.get_collection("achievements")
    if await achievements_collection.count_documents({}) == 0:
        await achievements_collection.insert_many(DEFAULT_ACHIEVEMENTS)


async def get_or_create_user_stats(db: Database, user_id: str) -> UserStats:
    """Get user stats or create new ones if they don't exist."""
    stats_collection = db.get_collection("user_stats")
    
    user_stats = await stats_collection.find_one({"user_id": user_id})
    
    if not user_stats:
        # Create new user stats
        new_stats = UserStats(user_id=user_id)
        result = await stats_collection.insert_one(new_stats.dict(exclude={"id"}))
        new_stats.id = str(result.inserted_id)
        return new_stats
    
    # Convert MongoDB document to UserStats
    user_stats["id"] = str(user_stats["_id"])
    del user_stats["_id"]
    return UserStats(**user_stats)


async def calculate_level_info(total_points: int, db: Database):
    """Calculate current level and progress."""
    levels_collection = db.get_collection("levels")
    levels = await levels_collection.find().sort("level", 1).to_list(None)
    
    current_level = 1
    current_level_progress = 0.0
    points_to_next_level = 0
    next_level_title = "Max Level"
    
    for i, level in enumerate(levels):
        if total_points >= level["points_required"]:
            current_level = level["level"]
        else:
            # This is the next level to reach
            if i > 0:
                prev_level_points = levels[i-1]["points_required"]
                level_points_needed = level["points_required"] - prev_level_points
                points_earned_in_level = total_points - prev_level_points
                current_level_progress = (points_earned_in_level / level_points_needed) * 100
            else:
                current_level_progress = (total_points / level["points_required"]) * 100
            
            points_to_next_level = level["points_required"] - total_points
            next_level_title = level["title"]
            break
    
    return current_level, current_level_progress, points_to_next_level, next_level_title


async def check_and_unlock_achievements(db: Database, user_id: str, user_stats: UserStats):
    """Check if user has unlocked any new achievements."""
    achievements_collection = db.get_collection("achievements")
    user_achievements_collection = db.get_collection("user_achievements")
    
    # Get all achievements
    all_achievements = await achievements_collection.find().to_list(None)
    
    # Get user's unlocked achievements
    unlocked_ids = []
    async for ua in user_achievements_collection.find({"user_id": user_id}):
        unlocked_ids.append(ua["achievement_id"])
    
    newly_unlocked = []
    
    for achievement in all_achievements:
        achievement_id = str(achievement["_id"])
        
        # Skip if already unlocked
        if achievement_id in unlocked_ids:
            continue
        
        # Check if condition is met
        condition_met = False
        condition_type = achievement["condition_type"]
        condition_value = achievement["condition_value"]
        
        if condition_type == "todo_count":
            condition_met = user_stats.total_todos_completed >= condition_value
        elif condition_type == "skill_count":
            condition_met = user_stats.total_skills_completed >= condition_value
        elif condition_type == "streak_days":
            condition_met = user_stats.streak_count >= condition_value
        elif condition_type == "points_total":
            condition_met = user_stats.total_points >= condition_value
        
        if condition_met:
            # Unlock achievement
            user_achievement = UserAchievement(
                user_id=user_id,
                achievement_id=achievement_id,
                unlocked_at=datetime.now().isoformat(),
                is_seen=False
            )
            
            await user_achievements_collection.insert_one(user_achievement.dict(exclude={"id"}))
            
            # Award points
            points_entry = PointsEntry(
                user_id=user_id,
                points=achievement["points_reward"],
                reason=PointsReason.ACHIEVEMENT_UNLOCKED,
                reference_id=achievement_id,
                metadata={"achievement_name": achievement["name"]}
            )
            
            await db.get_collection("points_history").insert_one(points_entry.dict(exclude={"id"}))
            newly_unlocked.append(user_achievement)
    
    return newly_unlocked


@router.on_event("startup")
async def startup_gamification():
    """Initialize gamification data on startup."""
    db = await get_database()
    await init_gamification_data(db)


@router.get("/stats/{user_id}", response_model=UserStatsResponse)
async def get_user_stats(user_id: str, db: Database = Depends(get_database)):
    """Get user's gamification statistics."""
    user_stats = await get_or_create_user_stats(db, user_id)
    
    # Calculate level info
    current_level, current_level_progress, points_to_next_level, next_level_title = await calculate_level_info(
        user_stats.total_points, db
    )
    
    # Update calculated fields
    user_stats.current_level = current_level
    user_stats.current_level_progress = current_level_progress
    
    return UserStatsResponse(
        **user_stats.dict(),
        points_to_next_level=points_to_next_level,
        next_level_title=next_level_title
    )


@router.post("/stats/{user_id}/update")
async def update_user_stats(user_id: str, update: UserStatsUpdate, db: Database = Depends(get_database)):
    """Update user statistics."""
    user_stats = await get_or_create_user_stats(db, user_id)
    
    # Update stats
    if update.points_to_add:
        user_stats.total_points += update.points_to_add
    
    if update.todos_completed:
        user_stats.total_todos_completed += update.todos_completed
    
    if update.skills_completed:
        user_stats.total_skills_completed += update.skills_completed
    
    if update.update_streak is not None and update.update_streak:
        # Update streak logic
        try:
            last_active = datetime.fromisoformat(user_stats.last_active_date.replace('Z', '+00:00'))
        except:
            # If parsing fails, treat as first time
            last_active = datetime.min
            
        today = datetime.now()
        
        # Special case: if streak is 0 or it's the first activity, always start at 1
        if user_stats.streak_count == 0:
            user_stats.streak_count = 1
            user_stats.longest_streak = max(user_stats.longest_streak, 1)
        else:
            # Check if it's a new day
            if last_active.date() < today.date():
                days_diff = (today.date() - last_active.date()).days
                
                if days_diff == 1:
                    # Consecutive day - increment streak
                    user_stats.streak_count += 1
                elif days_diff > 1:
                    # Streak broken - reset to 1 (new start)
                    user_stats.streak_count = 1
                # If days_diff == 0, it's the same day, don't change streak
                
                # Update longest streak
                if user_stats.streak_count > user_stats.longest_streak:
                    user_stats.longest_streak = user_stats.streak_count
    
    # Update timestamps
    user_stats.last_active_date = datetime.now().isoformat()
    user_stats.updated_at = datetime.now().isoformat()
    
    # Save to database
    stats_collection = db.get_collection("user_stats")
    await stats_collection.update_one(
        {"user_id": user_id},
        {"$set": user_stats.dict(exclude={"id"})}
    )
    
    # Check for new achievements
    newly_unlocked = await check_and_unlock_achievements(db, user_id, user_stats)
    
    return {
        "message": "Stats updated successfully",
        "newly_unlocked_achievements": len(newly_unlocked),
        "new_achievements": [ua.dict() for ua in newly_unlocked]
    }


@router.post("/points/{user_id}/add")
async def add_points(
    user_id: str,
    points: int,
    reason: PointsReason,
    reference_id: Optional[str] = None,
    db: Database = Depends(get_database)
):
    """Add points to user and record in history."""
    # Create points entry
    points_entry = PointsEntry(
        user_id=user_id,
        points=points,
        reason=reason,
        reference_id=reference_id
    )
    
    # Save to points history
    await db.get_collection("points_history").insert_one(points_entry.dict(exclude={"id"}))
    
    # Update user stats - for daily_login, also update streak
    if reason == PointsReason.DAILY_LOGIN:
        update = UserStatsUpdate(points_to_add=points, update_streak=True)
    else:
        update = UserStatsUpdate(points_to_add=points)
    
    return await update_user_stats(user_id, update, db)


@router.get("/achievements/{user_id}")
async def get_user_achievements(user_id: str, db: Database = Depends(get_database)):
    """Get user's achievements with progress."""
    # Get all achievements
    achievements_collection = db.get_collection("achievements")
    all_achievements = await achievements_collection.find().to_list(None)
    
    # Get user's unlocked achievements
    user_achievements_collection = db.get_collection("user_achievements")
    unlocked_achievements = await user_achievements_collection.find({"user_id": user_id}).to_list(None)
    unlocked_dict = {ua["achievement_id"]: ua for ua in unlocked_achievements}
    
    # Get user stats for progress calculation
    user_stats = await get_or_create_user_stats(db, user_id)
    
    achievements_with_progress = []
    
    for achievement in all_achievements:
        achievement_id = str(achievement["_id"])
        is_unlocked = achievement_id in unlocked_dict
        
        # Calculate progress
        progress = 0.0
        if not is_unlocked:
            condition_type = achievement["condition_type"]
            condition_value = achievement["condition_value"]
            
            if condition_type == "todo_count":
                progress = min((user_stats.total_todos_completed / condition_value) * 100, 100)
            elif condition_type == "skill_count":
                progress = min((user_stats.total_skills_completed / condition_value) * 100, 100)
            elif condition_type == "streak_days":
                progress = min((user_stats.streak_count / condition_value) * 100, 100)
            elif condition_type == "points_total":
                progress = min((user_stats.total_points / condition_value) * 100, 100)
        else:
            progress = 100.0
        
        achievement["id"] = achievement_id
        del achievement["_id"]
        
        achievement_with_progress = AchievementWithProgress(
            **achievement,
            is_unlocked=is_unlocked,
            progress=progress,
            unlocked_at=unlocked_dict[achievement_id]["unlocked_at"] if is_unlocked else None
        )
        
        achievements_with_progress.append(achievement_with_progress)
    
    return achievements_with_progress


@router.get("/summary/{user_id}", response_model=GamificationSummary)
async def get_gamification_summary(user_id: str, db: Database = Depends(get_database)):
    """Get comprehensive gamification summary for user."""
    # Get user stats
    stats_response = await get_user_stats(user_id, db)
    
    # Get recent achievements (last 10)
    user_achievements_collection = db.get_collection("user_achievements")
    recent_achievements_cursor = user_achievements_collection.find({"user_id": user_id}).sort("unlocked_at", -1).limit(10)
    recent_achievements = []
    async for ua in recent_achievements_cursor:
        ua["id"] = str(ua["_id"])
        del ua["_id"]
        recent_achievements.append(UserAchievement(**ua))
    
    # Get achievements close to unlocking (> 50% progress, not unlocked)
    all_achievements_with_progress = await get_user_achievements(user_id, db)
    next_achievements = [
        a for a in all_achievements_with_progress 
        if not a.is_unlocked and a.progress >= 50.0
    ]
    next_achievements.sort(key=lambda x: x.progress, reverse=True)
    next_achievements = next_achievements[:5]  # Top 5
    
    # Get recent points (last 20)
    points_collection = db.get_collection("points_history")
    recent_points_cursor = points_collection.find({"user_id": user_id}).sort("created_at", -1).limit(20)
    recent_points = []
    async for pe in recent_points_cursor:
        pe["id"] = str(pe["_id"])
        del pe["_id"]
        recent_points.append(PointsEntry(**pe))
    
    return GamificationSummary(
        stats=stats_response,
        recent_achievements=recent_achievements,
        next_achievements=next_achievements,
        recent_points=recent_points
    )


@router.post("/achievements/{user_id}/{achievement_id}/mark-seen")
async def mark_achievement_seen(
    user_id: str,
    achievement_id: str,
    db: Database = Depends(get_database)
):
    """Mark an achievement as seen by the user."""
    user_achievements_collection = db.get_collection("user_achievements")
    
    result = await user_achievements_collection.update_one(
        {"user_id": user_id, "achievement_id": achievement_id},
        {"$set": {"is_seen": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    return {"message": "Achievement marked as seen"}


@router.get("/levels", response_model=List[LevelConfig])
async def get_levels(db: Database = Depends(get_database)):
    """Get all level configurations."""
    levels_collection = db.get_collection("levels")
    levels = await levels_collection.find().sort("level", 1).to_list(None)
    
    result = []
    for level in levels:
        level["id"] = str(level["_id"])
        del level["_id"]
        result.append(LevelConfig(**level))
    
    return result


@router.post("/daily-login/{user_id}")
async def daily_login(user_id: str, db: Database = Depends(get_database)):
    """Handle daily login - award points and update streak in one operation."""
    user_stats = await get_or_create_user_stats(db, user_id)
    
    # Check if daily login already happened today
    try:
        last_active = datetime.fromisoformat(user_stats.last_active_date.replace('Z', '+00:00'))
    except:
        last_active = datetime.min
        
    today = datetime.now()
    
    # Check if it's a new day
    if last_active.date() < today.date() or user_stats.streak_count == 0:
        # Award daily login points
        points_entry = PointsEntry(
            user_id=user_id,
            points=10,
            reason=PointsReason.DAILY_LOGIN,
            reference_id=f"daily_login_{today.date()}"
        )
        
        # Save to points history
        await db.get_collection("points_history").insert_one(points_entry.dict(exclude={"id"}))
        
        # Update user stats with both points and streak
        user_stats.total_points += 10
        
        # Update streak logic (same as before)
        if user_stats.streak_count == 0:
            user_stats.streak_count = 1
            user_stats.longest_streak = max(user_stats.longest_streak, 1)
        else:
            if last_active.date() < today.date():
                days_diff = (today.date() - last_active.date()).days
                
                if days_diff == 1:
                    # Consecutive day - increment streak
                    user_stats.streak_count += 1
                elif days_diff > 1:
                    # Streak broken - reset to 1 (new start)
                    user_stats.streak_count = 1
                
                # Update longest streak
                if user_stats.streak_count > user_stats.longest_streak:
                    user_stats.longest_streak = user_stats.streak_count
        
        # Update timestamps
        user_stats.last_active_date = today.isoformat()
        user_stats.updated_at = today.isoformat()
        
        # Save to database
        stats_collection = db.get_collection("user_stats")
        await stats_collection.update_one(
            {"user_id": user_id},
            {"$set": user_stats.dict(exclude={"id"})}
        )
        
        # Check for new achievements
        newly_unlocked = await check_and_unlock_achievements(db, user_id, user_stats)
        
        return {
            "message": "Daily login successful",
            "points_awarded": 10,
            "current_streak": user_stats.streak_count,
            "newly_unlocked_achievements": len(newly_unlocked),
            "new_achievements": [ua.dict() for ua in newly_unlocked]
        }
    else:
        return {
            "message": "Daily login already completed today",
            "points_awarded": 0,
            "current_streak": user_stats.streak_count,
            "newly_unlocked_achievements": 0,
            "new_achievements": []
        }
