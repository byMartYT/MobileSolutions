import { View, Text, ScrollView, Animated, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Container from "../../components/Container";
import Title from "../../components/Title";
import LevelProgressCard from "../../components/LevelProgressCard";
import StreakCard from "../../components/StreakCard";
import StatsCard from "../../components/StatsCard";
import ActivityItem from "../../components/ActivityItem";
import AchievementCard from "../../components/AchievementCard";
import PlaceholderAchievementCard from "../../components/PlaceholderAchievementCard";
import RewardOverlay from "../../components/RewardOverlay";
import { useGamification } from "../../store/gamificationStore";
import { Target, Award, Flame } from "lucide-react-native";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/hooks/useAppTheme";

const styles = StyleSheet.create({
  // Text colors
  textBlack: { color: "#000000" },
});

const erfolge = () => {
  const {
    stats,
    achievements,
    recentPoints,
    pendingRewards,
    isLoading,
    currentLevel,
    totalPoints,
    streakCount,
    progressPercent,
    pointsToNext,
    nextLevelTitle,
    fetchData,
    dismissReward,
    clearAllRewards,
    awardPoints,
  } = useGamification();

  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const rewardAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();
  }, []);

  // Animate pending rewards
  useEffect(() => {
    if (pendingRewards.length > 0) {
      Animated.spring(rewardAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(rewardAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [pendingRewards.length]);

  const displayedAchievements = showAllAchievements
    ? achievements || []
    : (achievements || []).slice(0, 6);

  const handleDailyLogin = async () => {
    await awardPoints("daily_login");
  };

  const handleStreakBoost = async () => {
    await awardPoints("streak_bonus");
  };

  const { colorScheme } = useAppTheme();

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={true} className="flex-1">
        {/* Header */}
        <View className="mb-6">
          <Title className="mb-4">Deine Erfolge</Title>
          <Text className="text-lg" style={{ color: Colors[colorScheme].text }}>
            Sammle Punkte, erreiche neue Level und schalte Achievements frei!
          </Text>
        </View>

        {/* Level Progress Card */}
        <LevelProgressCard
          currentLevel={currentLevel}
          currentLevelProgress={progressPercent}
          totalPoints={totalPoints}
          pointsToNextLevel={pointsToNext}
          nextLevelTitle={nextLevelTitle}
          className="mb-6"
        />

        {/* Stats Grid */}
        <View className="flex-row mb-6 gap-3">
          <StreakCard
            currentStreak={streakCount}
            longestStreak={stats?.longest_streak || 0}
            lastActiveDate={stats?.last_active_date || new Date().toISOString()}
            onStreakBoost={handleStreakBoost}
            className="flex-1"
          />
          <View className="flex-1 gap-3 space-y-3">
            <StatsCard
              icon={<Target size={24} color="#3b82f6" />}
              title="Skills"
              value={stats?.total_skills_completed || 0}
              subtitle="Erlernt"
              color="bg-blue-600/20"
            />
            <StatsCard
              icon={<Award size={24} color="#10b981" />}
              title="Todos"
              value={stats?.total_todos_completed || 0}
              subtitle="Erledigt"
              color="bg-green-600/20"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <Text
            className="text-xl font-bold mb-4"
            style={{ color: Colors[colorScheme].text }}
          >
            Letzte Aktivität
          </Text>
          <View className="gap-3">
            {recentPoints && recentPoints.length > 0 ? (
              recentPoints.slice(0, 5).map((pointEntry, index) => {
                // Map point reasons to display information
                const getActivityInfo = (reason: string) => {
                  // Helper function to format date correctly handling UTC
                  const formatDate = (dateString: string) => {
                    // The server returns UTC time without 'Z', so we need to add it
                    const utcDateString = dateString.includes('Z') ? dateString : dateString + 'Z';
                    const date = new Date(utcDateString);
                    
                    const now = new Date();
                    const diffMs = now.getTime() - date.getTime();
                    const diffMins = Math.floor(diffMs / (1000 * 60));
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    
                    if (diffMins < 1) {
                      return "gerade eben";
                    } else if (diffMins < 60) {
                      return `vor ${diffMins} Min.`;
                    } else if (diffHours < 24) {
                      return `vor ${diffHours} Std.`;
                    } else if (diffDays === 1) {
                      return "gestern";
                    } else if (diffDays < 7) {
                      return `vor ${diffDays} Tagen`;
                    } else {
                      return date.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });
                    }
                  };

                  switch (reason) {
                    case "todo_completed":
                      return {
                        icon: <Target size={20} color="#3b82f6" />,
                        title: "Todo abgeschlossen",
                        subtitle: formatDate(pointEntry.created_at || new Date().toISOString()),
                      };
                    case "skill_completed":
                      return {
                        icon: <Award size={20} color="#10b981" />,
                        title: "Skill abgeschlossen",
                        subtitle: formatDate(pointEntry.created_at || new Date().toISOString()),
                      };
                    case "daily_login":
                      return {
                        icon: <Flame size={20} color="#ef4444" />,
                        title: "Tägliche Anmeldung",
                        subtitle: formatDate(pointEntry.created_at || new Date().toISOString()),
                      };
                    case "streak_bonus":
                      return {
                        icon: <Flame size={20} color="#ef4444" />,
                        title: "Streak Bonus",
                        subtitle: formatDate(pointEntry.created_at || new Date().toISOString()),
                      };
                    default:
                      return {
                        icon: <Award size={20} color="#10b981" />,
                        title: "Punkte erhalten",
                        subtitle: formatDate(pointEntry.created_at || new Date().toISOString()),
                      };
                  }
                };

                const activityInfo = getActivityInfo(pointEntry.reason);

                return (
                  <ActivityItem
                    key={pointEntry.id}
                    icon={activityInfo.icon}
                    title={activityInfo.title}
                    subtitle={activityInfo.subtitle}
                    points={pointEntry.points}
                  />
                );
              })
            ) : (
              <Text style={{ color: Colors[colorScheme].text }}>
                Noch keine Aktivitäten vorhanden.
              </Text>
            )}
          </View>
        </View>

        {/* Achievements */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className="text-xl font-bold"
              style={{ color: Colors[colorScheme].text }}
            >
              Achievements
            </Text>
          </View>

          <View className="gap-3">
            {displayedAchievements.length > 0
              ? displayedAchievements
                  .map((achievement, index) => (
                    <View
                      key={achievement.id}
                      className={`${index % 2 === 0 ? "flex-row" : ""} ${
                        index % 2 === 0 ? "gap-3" : ""
                      }`}
                    >
                      {index % 2 === 0 && (
                        <>
                          <AchievementCard
                            achievement={achievement}
                            index={index}
                          />
                          {displayedAchievements[index + 1] && (
                            <AchievementCard
                              achievement={displayedAchievements[index + 1]}
                              index={index + 1}
                            />
                          )}
                        </>
                      )}
                    </View>
                  ))
                  .filter((_, index) => index % 2 === 0)
              : // Placeholder achievements when none exist in grid format
                [...Array(3)].map((_, rowIndex) => (
                  <View key={rowIndex} className="flex-row gap-3">
                    <PlaceholderAchievementCard index={rowIndex * 2} />
                    <PlaceholderAchievementCard index={rowIndex * 2 + 1} />
                  </View>
                ))}
          </View>
        </View>
      </ScrollView>

      {/* Pending Rewards Overlay */}
      <RewardOverlay
        pendingRewards={pendingRewards}
        rewardAnimation={rewardAnimation}
        onClearRewards={clearAllRewards}
      />
    </Container>
  );
};

export default erfolge;
