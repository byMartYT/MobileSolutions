import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Trophy } from "lucide-react-native";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/hooks/useAppTheme";

const styles = StyleSheet.create({
  textGray500: { color: "#6b7280" },
  bgBlue500: { backgroundColor: "#3b82f6" },
  gradientYellowOrange: { backgroundColor: "rgba(251, 191, 36, 0.2)" },
});

interface AchievementCardProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    isUnlocked: boolean;
    progress?: number;
  };
  index: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  index,
}) => {
  const { colorScheme } = useAppTheme();

  return (
    <View
      className="flex-1 p-4 rounded-xl"
      style={
        achievement.isUnlocked
          ? styles.gradientYellowOrange
          : { backgroundColor: Colors[colorScheme].onSurfaceLight }
      }
    >
      <View className="items-center">
        <View className="w-12 h-12 rounded-full items-center justify-center mb-3">
          <Trophy
            size={24}
            color={achievement.isUnlocked ? "#fbbf24" : "#6b7280"}
          />
        </View>
        <Text
          className="font-medium text-center mb-1"
          style={{ color: Colors[colorScheme].text }}
        >
          {achievement.name}
        </Text>
        <Text className="text-xs text-center mb-2" style={styles.textGray500}>
          {achievement.description}
        </Text>
        {!achievement.isUnlocked && (
          <View
            className="w-full rounded-full h-2"
            style={{ backgroundColor: Colors[colorScheme].onSurface }}
          >
            <View
              className="h-2 rounded-full"
              style={[
                styles.bgBlue500,
                { width: `${achievement.progress || 0}%` },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default AchievementCard;
