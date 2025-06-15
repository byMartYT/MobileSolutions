// Gamification Types
export interface UserStats {
  id: string;
  userId: string;
  totalPoints: number;
  currentLevel: number;
  currentLevelProgress: number; // 0-100%
  streakCount: number;
  longestStreak: number;
  lastActiveDate: string;
  totalSkillsCompleted: number;
  totalTodosCompleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "skill" | "streak" | "general" | "speed" | "consistency";
  conditionType:
    | "todo_count"
    | "skill_count"
    | "streak_days"
    | "points_total"
    | "speed_completion";
  conditionValue: number;
  pointsReward: number;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievement: Achievement;
  unlockedAt: string;
  isSeen: boolean;
}

export interface PointsEntry {
  id: string;
  userId: string;
  points: number;
  reason:
    | "todo_completed"
    | "skill_completed"
    | "streak_bonus"
    | "achievement_unlocked"
    | "daily_login";
  referenceId?: string;
  createdAt: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  level: number;
  xp: number;
  xpToNext: number;
}

export interface LevelConfig {
  level: number;
  pointsRequired: number;
  title: string;
  rewards: string[];
}
