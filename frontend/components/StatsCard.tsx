import React from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  textBlack: { color: "#000000" },
  textBlackOpacity60: { color: "rgba(0, 0, 0, 0.6)" },
  bgBlue50020: { backgroundColor: "rgba(59, 130, 246, 0.2)" },
  bgGreen50020: { backgroundColor: "rgba(16, 185, 129, 0.2)" },
});

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color,
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

export default StatsCard;
