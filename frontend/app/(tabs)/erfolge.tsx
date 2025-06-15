import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Container from "../../components/Container";
import Title from "../../components/Title";
import LevelProgressCard from "../../components/LevelProgressCard";
import StreakCard from "../../components/StreakCard";
import { useGamification } from "../../store/gamificationStore";
import {
  Trophy,
  Flame,
  Target,
  Award,
  Zap,
  Calendar,
  ChevronRight,
  BarChart3,
} from "lucide-react-native";
import clsx from "clsx";

const styles = StyleSheet.create({
  // Text colors
  textBlack: { color: "#000000" },
  textWhite: { color: "#ffffff" },
  textGray400: { color: "#9ca3af" },
  textGray500: { color: "#6b7280" },
  textGray600: { color: "#4b5563" },
  textGray900: { color: "#111827" },
  textBlue400: { color: "#60a5fa" },
  textGreen400: { color: "#4ade80" },
  textBlackOpacity60: { color: "rgba(0, 0, 0, 0.6)" },

  // Background colors
  bgWhite: { backgroundColor: "#ffffff" },
  bgGray700: { backgroundColor: "#374151" },
  bgGray800: { backgroundColor: "#1f2937" },
  bgBlue500: { backgroundColor: "#3b82f6" },
  bgBlue600: { backgroundColor: "#2563eb" },
  bgBlue50020: { backgroundColor: "rgba(59, 130, 246, 0.2)" },
  bgGreen50020: { backgroundColor: "rgba(16, 185, 129, 0.2)" },
  bgGreen500: { backgroundColor: "#10b981" },
  bgYellow50030: { backgroundColor: "rgba(251, 191, 36, 0.3)" },
  bgYellow50020: { backgroundColor: "rgba(251, 191, 36, 0.2)" },
  bgOrange50020: { backgroundColor: "rgba(249, 115, 22, 0.2)" },
  bgBlackOpacity60: { backgroundColor: "rgba(0, 0, 0, 0.6)" },

  // Gradients (we'll use single colors as fallback)
  gradientYellowOrange: { backgroundColor: "rgba(251, 191, 36, 0.2)" },
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
      {pendingRewards.length > 0 && (
        <Animated.View
          style={[
            {
              transform: [{ scale: rewardAnimation }],
              opacity: rewardAnimation,
            },
            styles.bgBlackOpacity60,
          ]}
          className="absolute inset-0 flex items-center justify-center"
        >
          <View
            className="rounded-2xl p-6 mx-8 max-w-sm"
            style={styles.bgWhite}
          >
            <View className="items-center">
              <Zap size={48} color="#fbbf24" />
              <Text
                className="text-xl font-bold mt-4 mb-2"
                style={styles.textGray900}
              >
                Belohnung erhalten!
              </Text>
              {pendingRewards[0]?.type === "points" && (
                <Text className="text-center" style={styles.textGray600}>
                  Du hast {pendingRewards[0].points} Punkte erhalten!
                </Text>
              )}
              {pendingRewards[0]?.type === "achievement" && (
                <Text className="text-center" style={styles.textGray600}>
                  Achievement "{pendingRewards[0].achievement?.name}"
                  freigeschaltet!
                </Text>
              )}
              {pendingRewards[0]?.type === "level_up" && (
                <Text className="text-center" style={styles.textGray600}>
                  Level {pendingRewards[0].newLevel?.level} erreicht!
                </Text>
              )}
              <TouchableOpacity
                onPress={clearAllRewards}
                className="px-6 py-3 rounded-xl mt-4"
                style={styles.bgBlue600}
              >
                <Text className="font-semibold" style={styles.textWhite}>
                  Weiter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </Container>
  );
};

// Component: StatsCard
const StatsCard = ({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) => {
  const bgStyle = color.includes("blue")
    ? styles.bgBlue50020
    : styles.bgGreen50020;

  return (
    <View className="rounded-xl p-4 flex-1" style={bgStyle}>
      <View className="flex-row items-center justify-between mb-2">
        {icon}
        <Text className="text-2xl font-bold" style={styles.textBlack}>
          {value}
        </Text>
      </View>
      <Text className="font-medium" style={styles.textBlack}>
        {title}
      </Text>
      <Text className="text-xs" style={styles.textBlackOpacity60}>
        {subtitle}
      </Text>
    </View>
  );
};

// Component: ActivityItem
const ActivityItem = ({
  icon,
  title,
  subtitle,
  points,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  points: number;
}) => (
  <View
    className="rounded-xl p-4 flex-row items-center"
    style={styles.bgGray800}
  >
    <View className="mr-3">{icon}</View>
    <View className="flex-1">
      <Text className="font-medium" style={styles.textWhite}>
        {title}
      </Text>
      <Text className="text-sm" style={styles.textGray400}>
        {subtitle}
      </Text>
    </View>
    <View className="px-3 py-1 rounded-full" style={styles.bgGreen50020}>
      <Text className="font-medium" style={styles.textGreen400}>
        +{points}
      </Text>
    </View>
  </View>
);

// Component: AchievementCard
const AchievementCard = ({
  achievement,
  index,
}: {
  achievement: any;
  index: number;
}) => (
  <View
    className="flex-1 p-4 rounded-xl"
    style={
      achievement.isUnlocked ? styles.gradientYellowOrange : styles.bgGray800
    }
  >
    <View className="items-center">
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-3"
        style={achievement.isUnlocked ? styles.bgYellow50030 : styles.bgGray700}
      >
        <Trophy
          size={24}
          color={achievement.isUnlocked ? "#fbbf24" : "#6b7280"}
        />
      </View>
      <Text
        className="font-medium text-center mb-1"
        style={achievement.isUnlocked ? styles.textBlack : styles.textGray400}
      >
        {achievement.name}
      </Text>
      <Text className="text-xs text-center mb-2" style={styles.textGray500}>
        {achievement.description}
      </Text>
      {!achievement.isUnlocked && (
        <View className="w-full rounded-full h-2" style={styles.bgGray700}>
          <View
            className="h-2 rounded-full"
            style={[styles.bgBlue500, { width: `${achievement.progress}%` }]}
          />
        </View>
      )}
    </View>
  </View>
);

// Component: PlaceholderAchievementCard
const PlaceholderAchievementCard = ({ index }: { index: number }) => {
  const placeholderAchievements = [
    { name: "Erster Schritt", description: "Dein erstes Todo erledigen" },
    { name: "Aufsteiger", description: "Level 5 erreichen" },
    { name: "Beständig", description: "7 Tage Streak halten" },
    { name: "Fleißig", description: "10 Skills abschließen" },
    { name: "Sammler", description: "100 Punkte sammeln" },
    { name: "Meister", description: "Level 10 erreichen" },
  ];

  const achievement =
    placeholderAchievements[index] || placeholderAchievements[0];

  return (
    <View className="flex-1 p-4 rounded-xl" style={styles.bgGray800}>
      <View className="items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mb-3"
          style={styles.bgGray700}
        >
          <Trophy size={24} color="#6b7280" />
        </View>
        <Text className="font-medium text-center mb-1" style={styles.textWhite}>
          {achievement.name}
        </Text>
        <Text className="text-xs text-center mb-2" style={styles.textGray500}>
          {achievement.description}
        </Text>
        <View className="w-full rounded-full h-2" style={styles.bgGray700}>
          <View
            className="h-2 rounded-full"
            style={[styles.bgBlue500, { width: `${(index + 1) * 15}%` }]}
          />
        </View>
      </View>
    </View>
  );
};

export default erfolge;
