import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Crown, Star } from "lucide-react-native";
import clsx from "clsx";

const styles = StyleSheet.create({
  // Background colors based on level
  levelBg1: { backgroundColor: "#eab308" }, // yellow-600
  levelBg2: { backgroundColor: "#10b981" }, // green-600
  levelBg3: { backgroundColor: "#3b82f6" }, // blue-600
  levelBg4: { backgroundColor: "#6366f1" }, // indigo-600
  levelBg5: { backgroundColor: "#a855f7" }, // purple-600

  // Text colors
  textWhite: { color: "#ffffff" },
  textWhite80: { color: "rgba(255, 255, 255, 0.8)" },
  textWhite90: { color: "rgba(255, 255, 255, 0.9)" },

  // Background colors with opacity
  bgWhite20: { backgroundColor: "rgba(255, 255, 255, 0.2)" },
  bgWhite10: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
  bgWhite: { backgroundColor: "#ffffff" },
});

interface LevelProgressCardProps {
  currentLevel: number;
  currentLevelProgress: number;
  totalPoints: number;
  pointsToNextLevel: number;
  nextLevelTitle: string;
  className?: string;
}

const LevelProgressCard: React.FC<LevelProgressCardProps> = ({
  currentLevel,
  currentLevelProgress,
  totalPoints,
  pointsToNextLevel,
  nextLevelTitle,
  className,
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnimation, {
      toValue: currentLevelProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Pulse animation for level badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [currentLevelProgress]);

  const getLevelBackgroundStyle = (level: number) => {
    if (level >= 20) return styles.levelBg5; // purple
    if (level >= 15) return styles.levelBg4; // indigo
    if (level >= 10) return styles.levelBg3; // blue
    if (level >= 5) return styles.levelBg2; // green
    return styles.levelBg1; // yellow
  };

  const getLevelBadgeColor = (level: number) => {
    if (level >= 20) return "#a855f7";
    if (level >= 15) return "#6366f1";
    if (level >= 10) return "#3b82f6";
    if (level >= 5) return "#10b981";
    return "#eab308";
  };

  return (
    <View
      className={clsx("rounded-3xl p-6", className)}
      style={getLevelBackgroundStyle(currentLevel)}
    >
      {/* Header with Level Badge */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <Animated.View
            style={[
              {
                transform: [{ scale: pulseAnimation }],
                backgroundColor: "#FFFFFF60",
              },
            ]}
            className="rounded-full p-3 mr-4"
          >
            <Crown size={28} color={getLevelBadgeColor(currentLevel)} />
          </Animated.View>
          <View>
            <Text className="text-2xl font-bold" style={styles.textWhite}>
              Level {currentLevel}
            </Text>
            <Text className="text-sm" style={styles.textWhite80}>
              {totalPoints.toLocaleString()} Punkte total
            </Text>
          </View>
        </View>
        <View className="rounded-full px-3 py-1" style={styles.bgWhite10}>
          <Text className="text-xs font-semibold" style={styles.textWhite}>
            Noch {pointsToNextLevel} Punkte
          </Text>
        </View>
      </View>

      {/* Progress Section */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="font-medium" style={styles.textWhite90}>
            {nextLevelTitle}
          </Text>
          <Text className="text-sm" style={styles.textWhite80}>
            {Math.round(currentLevelProgress)}%
          </Text>
        </View>

        {/* Animated Progress Bar */}
        <View
          className="rounded-full h-3 overflow-hidden"
          style={styles.bgWhite20}
        >
          <Animated.View
            className="rounded-full h-full shadow-lg"
            style={[
              styles.bgWhite,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Level Perks Hint */}
      <View
        className="flex-row items-center rounded-xl p-3"
        style={styles.bgWhite10}
      >
        <Star size={16} color="#ffffff80" />
        <Text className="text-sm ml-2 flex-1" style={styles.textWhite80}>
          Nächstes Level: Neue Achievements & Belohnungen
        </Text>
      </View>
    </View>
  );
};

export default LevelProgressCard;
