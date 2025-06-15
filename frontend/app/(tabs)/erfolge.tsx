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

const styles = StyleSheet.create({
  // Text colors
  textBlack: { color: "#000000" },
});

const erfolge = () => {
  const {
    stats,
    achievements,
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

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={true} className="flex-1">
        {/* Header */}
        <View className="mb-6">
          <Title className="mb-4">Deine Erfolge</Title>
          <Text className="text-lg" style={styles.textBlack}>
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
            longestStreak={stats?.longestStreak || 0}
            lastActiveDate={stats?.lastActiveDate || new Date().toISOString()}
            onStreakBoost={handleStreakBoost}
            className="flex-1"
          />
          <View className="flex-1 gap-3 space-y-3">
            <StatsCard
              icon={<Target size={24} color="#3b82f6" />}
              title="Skills"
              value={stats?.totalSkillsCompleted || 0}
              subtitle="Abgeschlossen"
              color="bg-blue-600/20"
            />
            <StatsCard
              icon={<Award size={24} color="#10b981" />}
              title="Todos"
              value={stats?.totalTodosCompleted || 0}
              subtitle="Erledigt"
              color="bg-green-600/20"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <Text className="text-xl font-bold mb-4" style={styles.textBlack}>
            Letzte Aktivität
          </Text>
          <View className="gap-3">
            <ActivityItem
              icon={<Target size={20} color="#3b82f6" />}
              title="Todo abgeschlossen"
              subtitle="vor 2 Stunden"
              points={10}
            />
            <ActivityItem
              icon={<Flame size={20} color="#ef4444" />}
              title="Streak verlängert"
              subtitle="vor 1 Tag"
              points={20}
            />
            <ActivityItem
              icon={<Award size={20} color="#10b981" />}
              title="Achievement freigeschaltet"
              subtitle="vor 3 Tagen"
              points={50}
            />
          </View>
        </View>

        {/* Achievements */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold" style={styles.textBlack}>
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
