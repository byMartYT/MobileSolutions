import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/hooks/useAppTheme";

const styles = StyleSheet.create({
  textGray400: { color: "#9ca3af" },
  textGreen400: { color: "#4ade80" },
  bgGreen50020: { backgroundColor: "rgba(16, 185, 129, 0.2)" },
});

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  points: number;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  title,
  subtitle,
  points,
}) => {
  const { colorScheme } = useAppTheme();

  return (
    <View
      className="rounded-xl p-4 flex-row items-center"
      style={{ backgroundColor: Colors[colorScheme].onSurfaceLight }}
    >
      <View className="mr-3">{icon}</View>
      <View className="flex-1">
        <Text
          className="font-medium"
          style={{ color: Colors[colorScheme].text }}
        >
          {title}
        </Text>
        <Text className="text-sm" style={styles.textGray400}>
          {subtitle}
        </Text>
      </View>
      <View
        className="px-3 py-1 rounded-full"
        style={{ backgroundColor: Colors[colorScheme].successContainer }}
      >
        <Text
          className="font-medium"
          style={{ color: Colors[colorScheme].successContainerText }}
        >
          +{points}
        </Text>
      </View>
    </View>
  );
};

export default ActivityItem;
