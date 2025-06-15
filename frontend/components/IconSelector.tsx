import React from "react";
import { View, Text, Pressable } from "react-native";
import {
  Target,
  BookOpen,
  Dumbbell,
  Palette,
  Rocket,
  Zap,
  Flame,
  Star,
  Lightbulb,
  Music,
  Activity,
  Brain,
  Gamepad2,
  FileText,
  Wrench,
  Sprout,
} from "lucide-react-native";

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  selectedColor: string;
  title?: string;
}

const predefinedIcons = [
  { name: "Target", component: Target },
  { name: "BookOpen", component: BookOpen },
  { name: "Dumbbell", component: Dumbbell },
  { name: "Palette", component: Palette },
  { name: "Rocket", component: Rocket },
  { name: "Zap", component: Zap },
  { name: "Flame", component: Flame },
  { name: "Star", component: Star },
  { name: "Lightbulb", component: Lightbulb },
  { name: "Music", component: Music },
  { name: "Activity", component: Activity },
  { name: "Brain", component: Brain },
  { name: "Gamepad2", component: Gamepad2 },
  { name: "FileText", component: FileText },
  { name: "Wrench", component: Wrench },
  { name: "Sprout", component: Sprout },
];

export default function IconSelector({
  selectedIcon,
  onIconSelect,
  selectedColor,
  title = "Icon wählen",
}: IconSelectorProps) {
  return (
    <View className="gap-2">
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      <View className="flex-row flex-wrap gap-3" style={{ flexWrap: "wrap" }}>
        {predefinedIcons.map((iconOption) => {
          const IconComponent = iconOption.component;
          return (
            <Pressable
              key={iconOption.name}
              onPress={() => onIconSelect(iconOption.name)}
              className="relative rounded-xl items-center justify-center"
              style={{
                paddingBottom: 8,
              }}
            >
              <IconComponent size={44} color="#374151" />
              {selectedIcon === iconOption.name && (
                <View
                  style={{
                    backgroundColor: selectedColor,
                    height: 6,
                    width: 6,
                    position: "absolute",
                    bottom: 0,
                    borderRadius: 200,
                  }}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
