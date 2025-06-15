import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGamification } from "../store/gamificationStore";
import { useColorScheme } from "../components/useColorScheme";
import Colors from "../constants/Colors";

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color,
  backgroundColor,
  showLabel = false,
  label,
}) => {
  const colorScheme = useColorScheme();
  const defaultColor = color || Colors[colorScheme ?? "light"].tint;
  const defaultBgColor =
    backgroundColor || Colors[colorScheme ?? "light"].tabIconDefault;

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text
          style={[styles.label, { color: Colors[colorScheme ?? "light"].text }]}
        >
          {label || `${Math.round(clampedProgress)}%`}
        </Text>
      )}
      <View style={[styles.track, { height, backgroundColor: defaultBgColor }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: defaultColor,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  showProgress?: boolean;
  progressValue?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  showProgress = false,
  progressValue = 0,
}) => {
  const colorScheme = useColorScheme();
  const cardColor = color || Colors[colorScheme ?? "light"].tint;

  return (
    <View style={[styles.card, { borderLeftColor: cardColor }]}>
      <View style={styles.cardHeader}>
        <Text
          style={[
            styles.cardTitle,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          {title}
        </Text>
        {icon && <Text style={styles.cardIcon}>{icon}</Text>}
      </View>
      <Text style={[styles.cardValue, { color: cardColor }]}>{value}</Text>
      {subtitle && (
        <Text
          style={[
            styles.cardSubtitle,
            { color: Colors[colorScheme ?? "light"].tabIconDefault },
          ]}
        >
          {subtitle}
        </Text>
      )}
      {showProgress && (
        <View style={styles.cardProgress}>
          <ProgressBar progress={progressValue} color={cardColor} height={4} />
        </View>
      )}
    </View>
  );
};

interface GamificationSummaryProps {
  showDetailed?: boolean;
}

export const GamificationSummary: React.FC<GamificationSummaryProps> = ({
  showDetailed = false,
}) => {
  const {
    stats,
    currentLevel,
    totalPoints,
    streakCount,
    progressPercent,
    pointsToNext,
    nextLevelTitle,
    isLoading,
  } = useGamification();

  const colorScheme = useColorScheme();

  if (isLoading || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <Text
          style={[
            styles.loadingText,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          Loading stats...
        </Text>
      </View>
    );
  }

  const basicStats = [
    {
      title: "Level",
      value: currentLevel,
      subtitle: nextLevelTitle,
      icon: "🏆",
      color: "#9C27B0",
      showProgress: true,
      progressValue: progressPercent,
    },
    {
      title: "Points",
      value: totalPoints.toLocaleString(),
      subtitle: `${pointsToNext} to next level`,
      icon: "⭐",
      color: "#FF9800",
      showProgress: false,
      progressValue: 0,
    },
    {
      title: "Streak",
      value: `${streakCount} days`,
      subtitle: `Best: ${stats.longestStreak} days`,
      icon: "🔥",
      color: "#F44336",
      showProgress: false,
      progressValue: 0,
    },
  ];

  const detailedStats = [
    ...basicStats,
    {
      title: "Skills",
      value: stats.totalSkillsCompleted,
      subtitle: "Completed",
      icon: "🎯",
      color: "#4CAF50",
      showProgress: false,
      progressValue: 0,
    },
    {
      title: "Todos",
      value: stats.totalTodosCompleted,
      subtitle: "Completed",
      icon: "✅",
      color: "#2196F3",
      showProgress: false,
      progressValue: 0,
    },
  ];

  const statsToShow = showDetailed ? detailedStats : basicStats;

  return (
    <View style={styles.summaryContainer}>
      <Text
        style={[
          styles.summaryTitle,
          { color: Colors[colorScheme ?? "light"].text },
        ]}
      >
        Your Progress
      </Text>
      <View style={styles.statsGrid}>
        {statsToShow.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            showProgress={stat.showProgress}
            progressValue={stat.progressValue}
          />
        ))}
      </View>
    </View>
  );
};

interface LevelDisplayProps {
  compact?: boolean;
}

export const LevelDisplay: React.FC<LevelDisplayProps> = ({
  compact = false,
}) => {
  const { currentLevel, progressPercent, pointsToNext, nextLevelTitle } =
    useGamification();

  const colorScheme = useColorScheme();

  if (compact) {
    return (
      <View style={styles.levelCompact}>
        <Text
          style={[
            styles.levelCompactText,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          Level {currentLevel}
        </Text>
        <ProgressBar progress={progressPercent} height={4} showLabel={false} />
      </View>
    );
  }

  return (
    <View style={styles.levelContainer}>
      <Text
        style={[
          styles.levelNumber,
          { color: Colors[colorScheme ?? "light"].text },
        ]}
      >
        Level {currentLevel}
      </Text>
      <Text
        style={[
          styles.levelNext,
          { color: Colors[colorScheme ?? "light"].tabIconDefault },
        ]}
      >
        Next: {nextLevelTitle}
      </Text>
      <ProgressBar
        progress={progressPercent}
        height={12}
        showLabel={true}
        label={`${pointsToNext} points to go`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "right",
  },
  track: {
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    borderRadius: 4,
    height: "100%",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardIcon: {
    fontSize: 20,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
  },
  cardProgress: {
    marginTop: 8,
  },
  summaryContainer: {
    padding: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  statsGrid: {
    gap: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  levelContainer: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    marginVertical: 8,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  levelNext: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  levelCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  levelCompactText: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 60,
  },
});
