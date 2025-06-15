import React from "react";
import { View, Text } from "react-native";
import SkillItem from "./SkillItem";

interface SkillPreviewProps {
  title: string;
  goal: string;
  color: string;
  icon: string;
}

export default function SkillPreview({
  title,
  goal,
  color,
  icon,
}: SkillPreviewProps) {
  return (
    <View className="gap-2 mt-4">
      <Text className="text-lg font-semibold text-gray-900">Vorschau</Text>
      <SkillItem
        color={color}
        title={title || "Skill Vorschau"}
        handleConfetti={() => {}}
        completeConfetti={() => {}}
        removeSkill={() => {}}
        icon={icon}
        user="default-user"
        textColor="#FFFFFF"
        tip=""
        goal={goal || "Beschreibung des Ziels"}
        todos={[]}
        preview={true}
      />
    </View>
  );
}
