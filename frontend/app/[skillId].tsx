import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { api } from "@/api/api";
import { Todo } from "@/generated/api";
import Container from "@/components/Container";
import SkillFormInput from "@/components/SkillFormInput";
import ColorSelector from "@/components/ColorSelector";
import IconSelector from "@/components/IconSelector";
import SkillPreview from "@/components/SkillPreview";
import StepsManager from "@/components/StepsManager";
import Button from "@/components/Button";

const EditSkill = () => {
  const { skillId } = useLocalSearchParams();
  const [skill, setSkill] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Edit Skill",
      headerBackTitle: "Back",
      headerTitleStyle: { fontWeight: "bold" },
    });
  });

  useEffect(() => {
    const fetchSkill = async () => {
      if (!skillId || typeof skillId !== "string") {
        setError("Invalid skill ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.getTodoApiV1TodosTodoIdGet(skillId);
        setSkill(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching skill:", err);
        setError("Failed to load skill");
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [skillId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View className="flex-1 bg-gray-50">
        <Container>
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              className="gap-4 py-4"
              style={{ paddingTop: 16, paddingVertical: 48 }}
            >
              <SkillFormInput
                title={title}
                goal={goal}
                onTitleChange={setTitle}
                onGoalChange={setGoal}
              />

              <ColorSelector selectedColor={color} onColorSelect={setColor} />

              <IconSelector
                selectedIcon={icon}
                onIconSelect={setIcon}
                selectedColor={color}
              />

              <SkillPreview
                title={title}
                goal={goal}
                color={color}
                icon={icon}
              />

              <StepsManager
                steps={steps}
                nextTodo={nextTodo}
                onNextTodoChange={setNextTodo}
                onAddStep={handleAddStep}
                onRemoveStep={handleRemoveStep}
                onMoveStepUp={moveStepUp}
                onMoveStepDown={moveStepDown}
              />

              <Button
                onPress={handleSave}
                disabled={isLoading || !title.trim() || !goal.trim()}
              >
                {isLoading ? "Wird erstellt..." : "Skill erstellen"}
              </Button>
            </View>
          </ScrollView>
        </Container>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditSkill;
