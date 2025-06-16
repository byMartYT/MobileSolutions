import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  GamificationApi,
  UserStatsResponse,
  AchievementWithProgress,
  GamificationSummary,
  PointsEntry,
  LevelConfig,
  PointsReason,
  UserStatsUpdate,
} from "@/generated/api";
import { Configuration } from "@/generated/configuration";

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

// API Configuration
const apiConfig = new Configuration({
  basePath: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000",
});

const gamificationApi = new GamificationApi(apiConfig);

// Default user ID (in a real app, this would come from authentication)
const DEFAULT_USER_ID = "user_123";

// Additional types that extend the generated ones
export interface PendingReward {
  id: string;
  type: "points" | "achievement" | "level_up";
  points?: number;
  achievement?: AchievementWithProgress;
  newLevel?: LevelConfig;
  timestamp: string;
}

// Store State
interface GamificationState {
  // Data
  stats: UserStatsResponse | null;
  achievements: AchievementWithProgress[];
  levels: LevelConfig[];
  recentPoints: PointsEntry[];

  // UI State
  pendingRewards: PendingReward[];
  isLoading: boolean;
  lastSyncTime: string | null;

  // Methods
  fetchData: () => Promise<void>;
  fetchStats: (userId?: string) => Promise<UserStatsResponse>;
  fetchSummary: (userId?: string) => Promise<GamificationSummary>;
  fetchAchievements: (userId?: string) => Promise<AchievementWithProgress[]>;
  fetchLevels: () => Promise<LevelConfig[]>;
  awardPoints: (
    reason: string,
    points?: number,
    referenceId?: string
  ) => Promise<void>;
  dailyLogin: (userId?: string) => Promise<any>;
  updateUserStats: (update: UserStatsUpdate) => Promise<void>;
  completeTask: (
    taskType: "todo" | "skill",
    referenceId?: string
  ) => Promise<void>;
  dismissReward: (rewardId: string) => void;
  clearAllRewards: () => void;

  // Internal methods
  _updateStats: (newStats: Partial<UserStatsResponse>) => void;
  _addPendingReward: (reward: PendingReward) => void;
}

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

      // Methods
      fetchData: async () => {
        const userId = DEFAULT_USER_ID;
        set({ isLoading: true });

        try {
          const [summary, achievements] = await Promise.all([
            get().fetchSummary(userId),
            get().fetchAchievements(userId),
          ]);

          set({
            stats: summary.stats,
            achievements: achievements || [],
            recentPoints: summary.recent_points || [],
            lastSyncTime: new Date().toISOString(),
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchStats: async (userId = DEFAULT_USER_ID) => {
        try {
          const response =
            await gamificationApi.getUserStatsApiV1GamificationStatsUserIdGet(
              userId
            );
          return response.data;
        } catch (error) {
          // Return default stats on error
          return {
            user_id: userId,
            total_points: 0,
            current_level: 1,
            current_level_progress: 0,
            streak_count: 0,
            longest_streak: 0,
            last_active_date: new Date().toISOString(),
            total_skills_completed: 0,
            total_todos_completed: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            id: userId,
            points_to_next_level: 100,
            next_level_title: "Beginner",
          };
        }
      },

      fetchSummary: async (userId = DEFAULT_USER_ID) => {
        try {
          const response =
            await gamificationApi.getGamificationSummaryApiV1GamificationSummaryUserIdGet(
              userId
            );
          return response.data;
        } catch (error) {
          console.error("Failed to fetch summary:", error);
          // Return default summary on error
          const stats = await get().fetchStats(userId);
          return {
            stats,
            recent_achievements: [],
            next_achievements: [],
            recent_points: [],
          };
        }
      },

      fetchAchievements: async (userId = DEFAULT_USER_ID) => {
        try {
          const response =
            await gamificationApi.getUserAchievementsApiV1GamificationAchievementsUserIdGet(
              userId
            );
          return response.data;
        } catch (error) {
          console.error("Failed to fetch achievements:", error);
          // Return empty achievements on error
          return [];
        }
      },

      fetchLevels: async () => {
        try {
          const response =
            await gamificationApi.getLevelsApiV1GamificationLevelsGet();
          return response.data;
        } catch (error) {
          console.error("Failed to fetch levels:", error);
          // Return default levels on error
          return [];
        }
      },

      dailyLogin: async (userId = DEFAULT_USER_ID) => {
        try {
          console.log("🎯 Calling daily login API...");
          const response =
            await gamificationApi.dailyLoginApiV1GamificationDailyLoginUserIdPost(
              userId
            );

          console.log("🎯 Daily login response:", response.data);

          // Add pending reward if points were awarded
          if (response.data.points_awarded > 0) {
            get()._addPendingReward({
              id: `reward_${Date.now()}`,
              type: "points",
              points: response.data.points_awarded,
              timestamp: new Date().toISOString(),
            });

            // Only refresh data if points were actually awarded to avoid unnecessary requests
            await get().fetchData();
          } else {
            console.log("🎯 Daily login already completed today");
          }

          return response.data;
        } catch (error) {
          console.error("Failed to process daily login:", error);
          throw error;
        }
      },

      awardPoints: async (
        reason: string,
        points?: number,
        referenceId?: string
      ) => {
        const userId = DEFAULT_USER_ID;

        try {
          // Convert reason string to PointsReason enum
          const pointsReason = reason as PointsReason;

          await gamificationApi.addPointsApiV1GamificationPointsUserIdAddPost(
            userId,
            points || 10,
            pointsReason,
            referenceId
          );

          // Add pending reward
          get()._addPendingReward({
            id: `reward_${Date.now()}`,
            type: "points",
            points: points || 10,
            timestamp: new Date().toISOString(),
          });

          // Refresh data
          await get().fetchData();
        } catch (error) {
          console.error("Failed to award points:", error);
        }
      },

      updateUserStats: async (update: UserStatsUpdate) => {
        const userId = DEFAULT_USER_ID;

        try {
          await gamificationApi.updateUserStatsApiV1GamificationStatsUserIdUpdatePost(
            userId,
            update
          );

          // Refresh data to get updated stats
          await get().fetchData();
        } catch (error) {
          console.error("Failed to update user stats:", error);
        }
      },

      completeTask: async (
        taskType: "todo" | "skill",
        referenceId?: string
      ) => {
        const userId = DEFAULT_USER_ID;
        console.log(
          `🎮 completeTask: Starting ${taskType} completion for user:`,
          userId,
          "reference:",
          referenceId
        );

        try {
          if (taskType === "todo") {
            console.log("🎮 completeTask: Completing todo...");
            // Award points and update todo stats
            const [pointsResult, statsResult] = await Promise.all([
              gamificationApi.addPointsApiV1GamificationPointsUserIdAddPost(
                userId,
                10,
                PointsReason.TodoCompleted,
                referenceId
              ),
              gamificationApi.updateUserStatsApiV1GamificationStatsUserIdUpdatePost(
                userId,
                { todos_completed: 1, update_streak: true }
              ),
            ]);

            console.log(
              "🎮 completeTask: Todo API calls completed successfully"
            );

            // Add pending reward
            get()._addPendingReward({
              id: `reward_${Date.now()}`,
              type: "points",
              points: 10,
              timestamp: new Date().toISOString(),
            });
          } else if (taskType === "skill") {
            console.log("🎮 completeTask: Completing skill...");
            // Award bonus points for completing skill
            await Promise.all([
              gamificationApi.addPointsApiV1GamificationPointsUserIdAddPost(
                userId,
                25,
                PointsReason.SkillCompleted,
                referenceId
              ),
              gamificationApi.updateUserStatsApiV1GamificationStatsUserIdUpdatePost(
                userId,
                { skills_completed: 1, update_streak: true }
              ),
            ]);

            // Add pending reward
            get()._addPendingReward({
              id: `reward_${Date.now()}`,
              type: "points",
              points: 25,
              timestamp: new Date().toISOString(),
            });
          }

          // Refresh data to get updated stats and check for new achievements
          console.log("🎮 completeTask: Refreshing data...");
          await get().fetchData();

          // Force a re-render by updating a timestamp
          set({ lastSyncTime: new Date().toISOString() });

          console.log("🎮 completeTask: Task completion finished successfully");
        } catch (error) {
          console.error("🎮 completeTask: Failed to complete task:", error);
        }
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

      _updateStats: (newStats: Partial<UserStatsResponse>) => {
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
        getItem: async (key: string) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key: string, value: any) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key: string) => {
          await AsyncStorage.removeItem(key);
        },
      },
      partialize: (state) => ({
        // Don't persist stats to always get fresh data from API
        // stats: state.stats,
        achievements: state.achievements,
        levels: state.levels,
        recentPoints: state.recentPoints,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);

// Hook with computed values
export const useGamification = () => {
  const store = useGamificationStore();

  return {
    ...store,

    // Computed values with proper property names
    currentLevel: store.stats?.current_level || 1,
    totalPoints: store.stats?.total_points || 0,
    streakCount: store.stats?.streak_count || 0,
    progressPercent: store.stats?.current_level_progress || 0,
    pointsToNext: store.stats?.points_to_next_level || 0,
    nextLevelTitle: store.stats?.next_level_title || "Next Level",
  };
};

export default useGamificationStore;
