import { create } from "zustand";
import { persist } from "zustand/middleware";

// Try to import AsyncStorage, fallback to a simple in-memory storage
let AsyncStorage: any;
try {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
} catch (error) {
  console.warn("AsyncStorage not available, using in-memory storage");
  // Fallback in-memory storage
  AsyncStorage = {
    getItem: async (key: string) => {
      const storage = (global as any).__inMemoryStorage || {};
      return storage[key] || null;
    },
    setItem: async (key: string, value: string) => {
      const storage = (global as any).__inMemoryStorage || {};
      storage[key] = value;
      (global as any).__inMemoryStorage = storage;
    },
    removeItem: async (key: string) => {
      const storage = (global as any).__inMemoryStorage || {};
      delete storage[key];
      (global as any).__inMemoryStorage = storage;
    },
  };
}

// Types
export interface UserStats {
  id: string;
  userId: string;
  totalPoints: number;
  currentLevel: number;
  currentLevelProgress: number;
  streakCount: number;
  longestStreak: number;
  lastActiveDate: string;
  totalSkillsCompleted: number;
  totalTodosCompleted: number;
  createdAt: string;
  updatedAt: string;
  pointsToNextLevel: number;
  nextLevelTitle: string;
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
  isHidden: boolean;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  isSeen: boolean;
}

export interface AchievementWithProgress extends Achievement {
  isUnlocked: boolean;
  progress: number;
  unlockedAt?: string;
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
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface LevelConfig {
  id: string;
  level: number;
  pointsRequired: number;
  title: string;
  rewards: string[];
  color: string;
}

export interface GamificationSummary {
  stats: UserStats;
  recentAchievements: UserAchievement[];
  nextAchievements: AchievementWithProgress[];
  recentPoints: PointsEntry[];
}

export interface PendingReward {
  id: string;
  type: "points" | "achievement" | "level_up";
  points?: number;
  achievement?: Achievement;
  newLevel?: LevelConfig;
  timestamp: string;
}

// Store State
interface GamificationState {
  // Data
  stats: UserStats | null;
  achievements: AchievementWithProgress[];
  levels: LevelConfig[];
  recentPoints: PointsEntry[];

  // UI State
  pendingRewards: PendingReward[];
  isLoading: boolean;
  lastSyncTime: string | null;

  // Current user
  currentUserId: string;

  // Actions
  setCurrentUser: (userId: string) => void;
  fetchGamificationData: () => Promise<void>;
  syncStats: () => Promise<void>;
  awardPoints: (
    reason: string,
    referenceId?: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  markAchievementSeen: (achievementId: string) => Promise<void>;
  showPendingRewards: () => PendingReward[];
  dismissReward: (rewardId: string) => void;
  clearAllRewards: () => void;

  // Internal
  _updateStats: (newStats: Partial<UserStats>) => void;
  _addPendingReward: (reward: PendingReward) => void;
}

// API functions
const API_BASE = "http://localhost:8000/api/v1";
import mockGamificationApi from "./mockGamificationApi";

const api = {
  async fetchStats(userId: string): Promise<UserStats> {
    try {
      const response = await fetch(`${API_BASE}/gamification/stats/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    } catch (error) {
      console.log("Using mock data for stats");
      return mockGamificationApi.fetchStats(userId);
    }
  },

  async fetchSummary(userId: string): Promise<GamificationSummary> {
    try {
      const response = await fetch(
        `${API_BASE}/gamification/summary/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch summary");
      return response.json();
    } catch (error) {
      console.log("Using mock data for summary");
      return mockGamificationApi.fetchSummary(userId);
    }
  },

  async fetchAchievements(userId: string): Promise<AchievementWithProgress[]> {
    try {
      const response = await fetch(
        `${API_BASE}/gamification/achievements/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch achievements");
      return response.json();
    } catch (error) {
      console.log("Using mock data for achievements");
      return mockGamificationApi.fetchAchievements(userId);
    }
  },

  async fetchLevels(): Promise<LevelConfig[]> {
    try {
      const response = await fetch(`${API_BASE}/gamification/levels`);
      if (!response.ok) throw new Error("Failed to fetch levels");
      return response.json();
    } catch (error) {
      console.log("Using mock data for levels");
      return mockGamificationApi.fetchLevels();
    }
  },

  async addPoints(
    userId: string,
    points: number,
    reason: string,
    referenceId?: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE}/gamification/points/${userId}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points, reason, reference_id: referenceId }),
        }
      );
      if (!response.ok) throw new Error("Failed to add points");
      return response.json();
    } catch (error) {
      console.log("Using mock data for add points");
      return mockGamificationApi.addPoints(userId, points, reason, referenceId);
    }
  },

  async markAchievementSeen(
    userId: string,
    achievementId: string
  ): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE}/gamification/achievements/${userId}/${achievementId}/mark-seen`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Failed to mark achievement as seen");
    } catch (error) {
      console.log("Using mock data for mark achievement seen");
      return mockGamificationApi.markAchievementSeen(userId, achievementId);
    }
  },
};

// Create store
export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      stats: null,
      achievements: [],
      levels: [],
      recentPoints: [],
      pendingRewards: [],
      isLoading: false,
      lastSyncTime: null,
      currentUserId: "martin", // Default user

      // Actions
      setCurrentUser: (userId: string) => {
        set({ currentUserId: userId });
        get().fetchGamificationData();
      },

      fetchGamificationData: async () => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set({ isLoading: true });
        try {
          // Fetch all data in parallel
          const [summary, levels] = await Promise.all([
            api.fetchSummary(currentUserId),
            api.fetchLevels(),
          ]);

          set({
            stats: summary.stats,
            achievements: summary.nextAchievements || [], // Ensure it's always an array
            levels,
            recentPoints: summary.recentPoints || [], // Ensure it's always an array
            lastSyncTime: new Date().toISOString(),
            isLoading: false,
          });

          // Check for new achievements to show as rewards
          const unseenAchievements = (summary.recentAchievements || []).filter(
            (ua) => !ua.isSeen
          );
          unseenAchievements.forEach((ua) => {
            const achievement = (summary.nextAchievements || []).find(
              (a) => a.id === ua.achievementId
            );
            if (achievement) {
              get()._addPendingReward({
                id: `achievement_${ua.id}`,
                type: "achievement",
                achievement,
                timestamp: ua.unlockedAt,
              });
            }
          });
        } catch (error) {
          console.error("Failed to fetch gamification data:", error);
          set({ isLoading: false });
        }
      },

      syncStats: async () => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        try {
          const stats = await api.fetchStats(currentUserId);
          const oldStats = get().stats;

          // Check for level up
          if (oldStats && stats.currentLevel > oldStats.currentLevel) {
            const newLevel = get().levels.find(
              (l) => l.level === stats.currentLevel
            );
            if (newLevel) {
              get()._addPendingReward({
                id: `level_${stats.currentLevel}`,
                type: "level_up",
                newLevel,
                timestamp: new Date().toISOString(),
              });
            }
          }

          set({ stats, lastSyncTime: new Date().toISOString() });
        } catch (error) {
          console.error("Failed to sync stats:", error);
        }
      },

      awardPoints: async (
        reason: string,
        referenceId?: string,
        metadata?: Record<string, any>
      ) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        try {
          // Different point values for different reasons
          const pointValues: Record<string, number> = {
            todo_completed: 10,
            skill_completed: 25,
            daily_login: 5,
            streak_bonus: 20,
          };

          const points = pointValues[reason] || 10;

          // Add pending reward for immediate UI feedback
          get()._addPendingReward({
            id: `points_${Date.now()}`,
            type: "points",
            points,
            timestamp: new Date().toISOString(),
          });

          // Call API
          const result = await api.addPoints(
            currentUserId,
            points,
            reason,
            referenceId
          );

          // Update stats and check for new achievements
          await get().syncStats();

          if (result.newly_unlocked_achievements > 0) {
            // Refresh achievements to get latest data
            const achievements = await api.fetchAchievements(currentUserId);
            set({ achievements });
          }
        } catch (error) {
          console.error("Failed to award points:", error);
        }
      },

      markAchievementSeen: async (achievementId: string) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        try {
          await api.markAchievementSeen(currentUserId, achievementId);

          // Remove from pending rewards
          const pendingRewards = (get().pendingRewards || []).filter(
            (r) =>
              !(r.type === "achievement" && r.achievement?.id === achievementId)
          );
          set({ pendingRewards });
        } catch (error) {
          console.error("Failed to mark achievement as seen:", error);
        }
      },

      showPendingRewards: () => {
        return get().pendingRewards;
      },

      dismissReward: (rewardId: string) => {
        const pendingRewards = (get().pendingRewards || []).filter(
          (r) => r.id !== rewardId
        );
        set({ pendingRewards });
      },

      clearAllRewards: () => {
        set({ pendingRewards: [] });
      },

      // Internal methods
      _updateStats: (newStats: Partial<UserStats>) => {
        const currentStats = get().stats;
        if (currentStats) {
          set({ stats: { ...currentStats, ...newStats } });
        }
      },

      _addPendingReward: (reward: PendingReward) => {
        const pendingRewards = [...(get().pendingRewards || []), reward];
        set({ pendingRewards });
      },
    }),
    {
      name: "gamification-store",
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        // Only persist essential data, not UI state
        stats: state.stats,
        levels: state.levels,
        lastSyncTime: state.lastSyncTime,
        currentUserId: state.currentUserId,
      }),
    }
  )
);

// Hook for easy access to gamification functions
export const useGamification = () => {
  const store = useGamificationStore();

  return {
    // Data
    stats: store.stats,
    achievements: store.achievements || [],
    levels: store.levels || [],
    pendingRewards: store.pendingRewards || [],
    isLoading: store.isLoading,

    // Actions
    awardPoints: store.awardPoints,
    syncStats: store.syncStats,
    fetchData: store.fetchGamificationData,
    markAchievementSeen: store.markAchievementSeen,
    dismissReward: store.dismissReward,
    clearAllRewards: store.clearAllRewards,

    // Computed values
    currentLevel: store.stats?.currentLevel || 1,
    totalPoints: store.stats?.totalPoints || 0,
    streakCount: store.stats?.streakCount || 0,
    progressPercent: store.stats?.currentLevelProgress || 0,
    pointsToNext: store.stats?.pointsToNextLevel || 0,
    nextLevelTitle: store.stats?.nextLevelTitle || "Next Level",
  };
};
