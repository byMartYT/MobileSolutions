import React, { useState } from "react";
import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import Container from "@/components/Container";
import { api } from "@/api/api";
import useStore from "@/store/store";
import Button from "@/components/Button";
import SkillFormInput from "@/components/SkillFormInput";
import ColorSelector from "@/components/ColorSelector";
import IconSelector from "@/components/IconSelector";
import SkillPreview from "@/components/SkillPreview";
import StepsManager from "@/components/StepsManager";

export default function CreateSkill() {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [color, setColor] = useState("hsl(210, 64%, 62%)");
  const [icon, setIcon] = useState("Target");
  const [isLoading, setIsLoading] = useState(false);
  const { addSkill } = useStore();
  const [steps, setSteps] = useState<string[]>([]);
  const [nextTodo, setNextTodo] = useState("");

  const moveStepUp = (index: number) => {
    if (index > 0) {
      const newSteps = [...steps];
      [newSteps[index - 1], newSteps[index]] = [
        newSteps[index],
        newSteps[index - 1],
      ];
      setSteps(newSteps);
    }
  };

  const moveStepDown = (index: number) => {
    if (index < steps.length - 1) {
      const newSteps = [...steps];
      [newSteps[index], newSteps[index + 1]] = [
        newSteps[index + 1],
        newSteps[index],
      ];
      setSteps(newSteps);
    }
  };

  const handleAddStep = () => {
    if (nextTodo.trim()) {
      setSteps([...steps, nextTodo.trim()]);
      setNextTodo("");
    }
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim() || !goal.trim()) {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus.");
      return;
    }

    setIsLoading(true);
    let todos;
    try {
      todos = steps.map((step, index) => {
        console.log(`Creating todo ${index + 1}: ${step}`);
        const todoId = `todo_${Date.now()}_${index}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        return {
          text: step.trim(),
          status: false,
          id: todoId,
        };
      });
    } catch (todoError) {
      setIsLoading(false);
      return;
    }

    let newSkill;
    try {
      newSkill = {
        title: title.trim(),
        goal: goal.trim(),
        color: String(color),
        icon,
        user: "default-user",
        textColor: "#FFFFFF",
        tip: "",
        todos: todos,
      };
    } catch (objError) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.createTodoApiV1TodosPost(newSkill);
      addSkill(response.data);
      router.back();
    } catch (error) {
      console.error("Fehler beim Erstellen des Skills:", error);
      Alert.alert("Fehler", "Skill konnte nicht erstellt werden.");
    } finally {
      setIsLoading(false);
    }
  };

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
}
