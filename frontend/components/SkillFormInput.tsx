import React from "react";
import { View, Text, TextInput } from "react-native";

interface SkillFormInputProps {
  title: string;
  goal: string;
  onTitleChange: (text: string) => void;
  onGoalChange: (text: string) => void;
}

export default function SkillFormInput({
  title,
  goal,
  onTitleChange,
  onGoalChange,
}: SkillFormInputProps) {
  return (
    <>
      {/* Title Input */}
      <View className="gap-2">
        <Text className="text-lg font-semibold text-gray-900">
          Welchen Skill möchtest du lernen?
        </Text>
        <TextInput
          value={title}
          onChangeText={onTitleChange}
          placeholder="z.B. Halbmarathon"
          className="border border-gray-300 rounded-xl p-4 text-base bg-white"
          maxLength={50}
        />
      </View>

      {/* Goal Input */}
      <View className="gap-2">
        <Text className="text-lg font-semibold text-gray-900">
          Beschreibe dein Lernziel
        </Text>
        <TextInput
          value={goal}
          onChangeText={onGoalChange}
          placeholder="Beschreiben Sie Ihr Lernziel..."
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-xl p-4 text-base bg-white"
          textAlignVertical="top"
          maxLength={200}
        />
      </View>
    </>
  );
}
