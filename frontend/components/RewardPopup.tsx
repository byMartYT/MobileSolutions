import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGamification } from "../store/gamificationStore";
import { useColorScheme } from "../components/useColorScheme";
import Colors from "../constants/Colors";

const { width, height } = Dimensions.get("window");

interface RewardPopupProps {
  visible: boolean;
  onDismiss: () => void;
}

export const RewardPopup: React.FC<RewardPopupProps> = ({
  visible,
  onDismiss,
}) => {
  const { pendingRewards, dismissReward, markAchievementSeen } =
    useGamification();
  const colorScheme = useColorScheme();
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));

  const currentReward = pendingRewards[currentRewardIndex];

  useEffect(() => {
    if (visible && currentReward) {
      // Animate in
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        // Optional: Auto-dismiss after 3 seconds for points
        ...(currentReward.type === "points"
          ? [
              Animated.delay(3000),
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]
          : []),
      ]).start((finished) => {
        if (finished && currentReward.type === "points") {
          handleNext();
        }
      });
    }
  }, [visible, currentReward]);

  const handleNext = () => {
    if (currentReward) {
      dismissReward(currentReward.id);

      if (currentReward.type === "achievement" && currentReward.achievement) {
        markAchievementSeen(currentReward.achievement.id);
      }
    }

    if (currentRewardIndex < pendingRewards.length - 1) {
      setCurrentRewardIndex(currentRewardIndex + 1);
      animatedValue.setValue(0);
    } else {
      setCurrentRewardIndex(0);
      onDismiss();
    }
  };

  const handleSkipAll = () => {
    pendingRewards.forEach((reward) => {
      dismissReward(reward.id);
      if (reward.type === "achievement" && reward.achievement) {
        markAchievementSeen(reward.achievement.id);
      }
    });
    setCurrentRewardIndex(0);
    onDismiss();
  };

  if (!visible || !currentReward) {
    return null;
  }

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const renderRewardContent = () => {
    switch (currentReward.type) {
      case "points":
        return (
          <View style={styles.rewardContent}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#FF9800" }]}
            >
              <Ionicons name="star" size={48} color="white" />
            </View>
            <Text
              style={[
                styles.rewardTitle,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              Points Earned!
            </Text>
            <Text style={[styles.rewardValue, { color: "#FF9800" }]}>
              +{currentReward.points}
            </Text>
            <Text
              style={[
                styles.rewardSubtitle,
                { color: Colors[colorScheme ?? "light"].tabIconDefault },
              ]}
            >
              Great job! Keep it up!
            </Text>
          </View>
        );

      case "achievement":
        const achievement = currentReward.achievement!;
        return (
          <View style={styles.rewardContent}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#9C27B0" }]}
            >
              <Text style={styles.achievementIcon}>
                {getAchievementIcon(achievement.icon)}
              </Text>
            </View>
            <Text
              style={[
                styles.rewardTitle,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              Achievement Unlocked!
            </Text>
            <Text style={[styles.achievementName, { color: "#9C27B0" }]}>
              {achievement.name}
            </Text>
            <Text
              style={[
                styles.rewardSubtitle,
                { color: Colors[colorScheme ?? "light"].tabIconDefault },
              ]}
            >
              {achievement.description}
            </Text>
            <View style={styles.pointsReward}>
              <Ionicons name="star" size={16} color="#FF9800" />
              <Text style={[styles.pointsText, { color: "#FF9800" }]}>
                +{achievement.pointsReward} points
              </Text>
            </View>
          </View>
        );

      case "level_up":
        const level = currentReward.newLevel!;
        return (
          <View style={styles.rewardContent}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#4CAF50" }]}
            >
              <Ionicons name="trophy" size={48} color="white" />
            </View>
            <Text
              style={[
                styles.rewardTitle,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              Level Up!
            </Text>
            <Text style={[styles.levelNumber, { color: "#4CAF50" }]}>
              Level {level.level}
            </Text>
            <Text style={[styles.levelTitle, { color: "#4CAF50" }]}>
              {level.title}
            </Text>
            {level.rewards.length > 0 && (
              <View style={styles.rewardsContainer}>
                <Text
                  style={[
                    styles.rewardsTitle,
                    { color: Colors[colorScheme ?? "light"].tabIconDefault },
                  ]}
                >
                  New Rewards:
                </Text>
                {level.rewards.map((reward, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.rewardItem,
                      { color: Colors[colorScheme ?? "light"].text },
                    ]}
                  >
                    • {reward}
                  </Text>
                ))}
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleNext}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {renderRewardContent()}

          <View style={styles.buttonContainer}>
            {currentReward.type !== "points" && (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>
                  {currentRewardIndex < pendingRewards.length - 1
                    ? "Next"
                    : "Awesome!"}
                </Text>
              </TouchableOpacity>
            )}

            {pendingRewards.length > 1 &&
              currentRewardIndex < pendingRewards.length - 1 && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={handleSkipAll}
                >
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      { color: Colors[colorScheme ?? "light"].tabIconDefault },
                    ]}
                  >
                    Skip All
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          {pendingRewards.length > 1 && (
            <View style={styles.indicator}>
              <Text
                style={[
                  styles.indicatorText,
                  { color: Colors[colorScheme ?? "light"].tabIconDefault },
                ]}
              >
                {currentRewardIndex + 1} of {pendingRewards.length}
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const getAchievementIcon = (iconName: string): string => {
  const iconMap: Record<string, string> = {
    target: "🎯",
    trophy: "🏆",
    flame: "🔥",
    fire: "🔥",
    zap: "⚡",
    star: "⭐",
    "hundred-points": "💯",
    "graduation-cap": "🎓",
    medal: "🏅",
    crown: "👑",
    gem: "💎",
    rocket: "🚀",
  };

  return iconMap[iconName] || "🏆";
};

// Auto-show hook
export const useRewardDisplay = () => {
  const { pendingRewards } = useGamification();
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    if (pendingRewards.length > 0 && !showRewards) {
      // Small delay to ensure smooth transition
      setTimeout(() => setShowRewards(true), 100);
    }
  }, [pendingRewards.length]);

  const handleDismiss = () => {
    setShowRewards(false);
  };

  return {
    showRewards: showRewards && pendingRewards.length > 0,
    handleDismiss,
    RewardPopup: () => (
      <RewardPopup
        visible={showRewards && pendingRewards.length > 0}
        onDismiss={handleDismiss}
      />
    ),
  };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxWidth: width * 0.85,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  rewardContent: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementIcon: {
    fontSize: 40,
  },
  rewardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  rewardValue: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  rewardSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  pointsReward: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "600",
  },
  rewardsContainer: {
    alignItems: "center",
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  rewardItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  secondaryButtonText: {
    fontSize: 16,
  },
  indicator: {
    marginTop: 16,
  },
  indicatorText: {
    fontSize: 12,
  },
});
