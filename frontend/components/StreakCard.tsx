import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Flame, Calendar, TrendingUp } from "lucide-react-native";
import clsx from "clsx";

const styles = StyleSheet.create({
  // Streak background colors based on streak count
  streakBgGray: { backgroundColor: "#6b7280" }, // gray-600
  streakBgYellow: { backgroundColor: "#eab308" }, // yellow-500
  streakBgOrange: { backgroundColor: "#f97316" }, // orange-500
  streakBgRed: { backgroundColor: "#ef4444" }, // red-500
  streakBgPurple: { backgroundColor: "#a855f7" }, // purple-600

  // Text colors
  textWhite: { color: "#ffffff" },
  textWhite80: { color: "rgba(255, 255, 255, 0.8)" },
  textWhite60: { color: "rgba(255, 255, 255, 0.6)" },
  textGreen200: { color: "#bbf7d0" },
  textRed200: { color: "#fecaca" },

  // Background colors with opacity
  bgWhite20: { backgroundColor: "rgba(255, 255, 255, 0.2)" },
  bgGreen50030: { backgroundColor: "rgba(34, 197, 94, 0.3)" },
  bgRed50030: { backgroundColor: "rgba(239, 68, 68, 0.3)" },
});

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  onStreakBoost?: () => void;
  className?: string;
}

const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  lastActiveDate,
  onStreakBoost,
  className,
}) => {
  const getStreakBackgroundStyle = () => {
    if (currentStreak >= 30) return styles.streakBgPurple;
    if (currentStreak >= 14) return styles.streakBgRed;
    if (currentStreak >= 7) return styles.streakBgOrange;
    if (currentStreak >= 3) return styles.streakBgYellow;
    return styles.streakBgGray;
  };

  const getStreakIntensity = () => {
    if (currentStreak >= 30) return "Legendär!";
    if (currentStreak >= 14) return "Unglaublich!";
    if (currentStreak >= 7) return "Stark!";
    if (currentStreak >= 3) return "Gut!";
    return "Starte deine Serie!";
  };

  const isStreakActive = () => {
    const today = new Date();
    const lastActive = new Date(lastActiveDate);
    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  };

  return (
    <View
      className={clsx("rounded-2xl p-5", className)}
      style={getStreakBackgroundStyle()}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Flame size={32} color={currentStreak > 0 ? "#ff6b35" : "#9CA2AC"} />
          <View>
            <Text className="text-lg font-bold" style={styles.textWhite}>
              Streak
            </Text>
            <Text className="text-sm" style={styles.textWhite80}>
              {getStreakIntensity()}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Streak Display */}
      <View className="items-center mb-4">
        <Text className="text-4xl font-bold" style={styles.textWhite}>
          {currentStreak}
        </Text>
        <Text className="text-lg" style={styles.textWhite80}>
          {currentStreak === 1 ? "Tag" : "Tage"}
        </Text>
      </View>

      {/* Stats Row */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="items-center flex-1">
          <TrendingUp size={20} color="#fff" />
          <Text className="text-xs mt-1" style={styles.textWhite60}>
            Rekord
          </Text>
          <Text className="font-semibold" style={styles.textWhite}>
            {longestStreak}
          </Text>
        </View>
        <View className="items-center flex-1">
          <Calendar size={20} color="#fff" />
          <Text className="text-xs mt-1" style={styles.textWhite60}>
            Letzter Tag
          </Text>
          <Text className="font-semibold" style={styles.textWhite}>
            {new Date(lastActiveDate).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
            })}
          </Text>
        </View>
      </View>

      {/* Action Button */}
      {onStreakBoost && (
        <TouchableOpacity
          onPress={onStreakBoost}
          className="rounded-xl py-3 items-center"
          style={styles.bgWhite20}
        >
          <Text className="font-semibold" style={styles.textWhite}>
            {isStreakActive() ? "Streak verlängern" : "Streak starten"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default StreakCard;
