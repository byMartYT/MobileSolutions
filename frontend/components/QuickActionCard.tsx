import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/hooks/useAppTheme";

const styles = StyleSheet.create({
  textGray400: { color: "#9ca3af" },
});

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => {
  const { colorScheme } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 mx-1 rounded-xl p-4 items-center"
      style={{ backgroundColor: Colors[colorScheme].onSurfaceLight }}
    >
      <View className="mb-2">{icon}</View>
      <Text
        className="font-medium text-center"
        style={{ color: Colors[colorScheme].text }}
      >
        {title}
      </Text>
      <Text className="text-xs text-center" style={styles.textGray400}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
};

export default QuickActionCard;
