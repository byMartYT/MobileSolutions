import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Zap } from "lucide-react-native";

export interface PendingReward {
  type: "points" | "achievement" | "level_up";
  points?: number;
  achievement?: { name: string };
  newLevel?: { level: number };
}

const styles = StyleSheet.create({
  textWhite: { color: "#ffffff" },
  textGray600: { color: "#4b5563" },
  textGray900: { color: "#111827" },
  bgWhite: { backgroundColor: "#ffffff" },
  bgBlue600: { backgroundColor: "#2563eb" },
  bgBlackOpacity60: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
});

interface RewardOverlayProps {
  pendingRewards: PendingReward[];
  rewardAnimation: Animated.Value;
  onClearRewards: () => void;
}

const RewardOverlay: React.FC<RewardOverlayProps> = ({
  pendingRewards,
  rewardAnimation,
  onClearRewards,
}) => {
  if (pendingRewards.length === 0) return null;

  return (
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
      <View className="rounded-2xl p-6 mx-8 max-w-sm" style={styles.bgWhite}>
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
            onPress={onClearRewards}
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
  );
};

export default RewardOverlay;
