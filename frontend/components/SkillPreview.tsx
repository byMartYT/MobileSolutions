import React from "react";
import { View, Text } from "react-native";
import SkillItem from "./SkillItem";
import { Todo } from "@/generated";

interface SkillPreviewProps {
  title: string;
  goal: string;
  color: string;
  icon: string;
  todos?: {
    status: boolean;
    text: string;
  }[];
}

export default function SkillPreview({
  title,
  goal,
  color,
  icon,
  todos = [],
}: SkillPreviewProps) {
  // Convert todos to TodoItem format with IDs
  const todosWithIds = todos.map((todo, index) => ({
    id: `preview-${index}`,
    text: todo.text,
    status: todo.status,
  }));

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
        todos={todosWithIds}
        preview={true}
        notClickable={true}
      />
    </View>
  );
}
