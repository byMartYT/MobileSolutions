import React from "react";
import { View, Text, Pressable } from "react-native";
import clsx from "clsx";

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  title?: string;
}

const predefinedColors = [
  "hsl(210, 64%, 62%)", // Blue
  "hsl(240, 64%, 62%)", // Blue
  "hsl(350, 64%, 62%)", // Blue
  "hsl(150, 64%, 62%)", // Green
  "hsl(0, 64%, 62%)", // Red
  "hsl(90, 64%, 62%)", // Red
  "hsl(280, 64%, 62%)", // Purple
  "hsl(30, 64%, 62%)", // Orange
  "hsl(120, 64%, 62%)", // Lime
  "hsl(330, 64%, 62%)", // Magenta
];

export default function ColorSelector({
  selectedColor,
  onColorSelect,
  title = "Farbe wählen",
}: ColorSelectorProps) {
  return (
    <View className="gap-2">
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      <View
        className="flex-row gap-3 flex-wrap justify-start"
        style={{ flexWrap: "wrap" }}
      >
        {predefinedColors.map((colorOption) => {
          return (
            <Pressable
              key={colorOption}
              onPress={() => onColorSelect(colorOption)}
              className={clsx(
                "rounded-xl mb-3",
                selectedColor === colorOption && "border-4 border-gray-800"
              )}
              style={{
                width: 60,
                height: 60,
                aspectRatio: 1,
                backgroundColor: colorOption,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
