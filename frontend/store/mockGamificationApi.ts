// Mock implementation for gamification features until backend is ready
export const mockGamificationApi = {
  async fetchStats(userId: string) {
    // Mock user stats
    return {
      id: `stats_${userId}`,
      userId,
      totalPoints: 127,
      currentLevel: 3,
      currentLevelProgress: 65,
      streakCount: 5,
      longestStreak: 12,
      lastActiveDate: new Date().toISOString(),
      totalSkillsCompleted: 4,
      totalTodosCompleted: 23,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pointsToNextLevel: 73,
      nextLevelTitle: "Fortgeschrittener",
    };
  },

  async fetchSummary(userId: string) {
    const stats = await this.fetchStats(userId);
    const achievements = this.getMockAchievements();
    return {
      stats,
      recentAchievements: [],
      nextAchievements: achievements,
      recentPoints: this.getMockRecentPoints(),
    };
  },

  async fetchAchievements(userId: string) {
    return this.getMockAchievements();
  },

  async fetchLevels() {
    return [
      {
        id: "1",
        level: 1,
        pointsRequired: 0,
        title: "Anfänger",
        rewards: ["Erste Schritte"],
        color: "#10b981",
      },
      {
        id: "2",
        level: 2,
        pointsRequired: 50,
        title: "Lernender",
        rewards: ["Bonus-Punkte"],
        color: "#3b82f6",
      },
      {
        id: "3",
        level: 3,
        pointsRequired: 150,
        title: "Enthusiast",
        rewards: ["Streak-Bonus"],
        color: "#6366f1",
      },
      {
        id: "4",
        level: 4,
        pointsRequired: 300,
        title: "Fortgeschrittener",
        rewards: ["Neue Features"],
        color: "#8b5cf6",
      },
      {
        id: "5",
        level: 5,
        pointsRequired: 500,
        title: "Experte",
        rewards: ["Exklusive Belohnungen"],
        color: "#a855f7",
      },
    ];
  },

  async addPoints(
    userId: string,
    points: number,
    reason: string,
    referenceId?: string
  ) {
    console.log(`Mock: Awarded ${points} points to ${userId} for ${reason}`);
    return { success: true, newly_unlocked_achievements: 0 };
  },

  async markAchievementSeen(userId: string, achievementId: string) {
    console.log(
      `Mock: Marked achievement ${achievementId} as seen for ${userId}`
    );
  },

  getMockAchievements() {
    return [
      {
        id: "1",
        name: "Erster Schritt",
        description: "Dein erstes Todo abgeschlossen",
        icon: "star",
        category: "general" as const,
        conditionType: "todo_count" as const,
        conditionValue: 1,
        pointsReward: 10,
        isHidden: false,
        createdAt: new Date().toISOString(),
        isUnlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Ausdauernd",
        description: "5 Tage in Folge aktiv",
        icon: "flame",
        category: "streak" as const,
        conditionType: "streak_days" as const,
        conditionValue: 5,
        pointsReward: 25,
        isHidden: false,
        createdAt: new Date().toISOString(),
        isUnlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Hundertschaft",
        description: "100 Punkte erreichen",
        icon: "trophy",
        category: "general" as const,
        conditionType: "points_total" as const,
        conditionValue: 100,
        pointsReward: 20,
        isHidden: false,
        createdAt: new Date().toISOString(),
        isUnlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Skill-Meister",
        description: "Einen ganzen Skill abschließen",
        icon: "crown",
        category: "skill" as const,
        conditionType: "skill_count" as const,
        conditionValue: 1,
        pointsReward: 50,
        isHidden: false,
        createdAt: new Date().toISOString(),
        isUnlocked: false,
        progress: 80,
      },
      {
        id: "5",
        name: "Fleißbienchen",
        description: "25 Todos abschließen",
        icon: "star",
        category: "general" as const,
        conditionType: "todo_count" as const,
        conditionValue: 25,
        pointsReward: 30,
        isHidden: false,
        createdAt: new Date().toISOString(),
        isUnlocked: false,
        progress: 92,
      },
      {
        id: "6",
        name: "Punktesammler",
        description: "250 Punkte erreichen",
        icon: "trophy",
        category: "general" as const,
        conditionType: "points_total" as const,
        conditionValue: 250,
        pointsReward: 50,
        isHidden: false,
        createdAt: new Date().toISOString(),
        isUnlocked: false,
        progress: 51,
      },
    ];
  },

  getMockRecentPoints() {
    return [
      {
        id: "1",
        userId: "martin",
        points: 10,
        reason: "todo_completed" as const,
        referenceId: "todo_123",
        metadata: { skillTitle: "React lernen" },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        id: "2",
        userId: "martin",
        points: 5,
        reason: "daily_login" as const,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        id: "3",
        userId: "martin",
        points: 20,
        reason: "streak_bonus" as const,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      },
    ];
  },
};

export default mockGamificationApi;
