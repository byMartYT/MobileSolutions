import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { api } from "@/api/api";
import { Todo } from "@/generated/api";
import Container from "@/components/Container";
import SkillFormInput from "@/components/SkillFormInput";
import ColorSelector from "@/components/ColorSelector";
import IconSelector from "@/components/IconSelector";
import SkillPreview from "@/components/SkillPreview";
import StepsManager from "@/components/StepsManager";
import Button from "@/components/Button";
import useStore from "@/store/store";
import { useAppTheme } from "@/hooks/useAppTheme";
import Colors from "@/constants/Colors";

const EditSkill = () => {
  const { skillId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { updateSkill, removeSkill } = useStore();
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  // Original skill data
  const [skill, setSkill] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [color, setColor] = useState("hsl(210, 64%, 62%)");
  const [icon, setIcon] = useState("Target");
  const [steps, setSteps] = useState<string[]>([]);
  const [nextTodo, setNextTodo] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteSkill = () => {
    Alert.alert(
      "Skill löschen",
      "Möchten Sie diesen Skill wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      [
        {
          text: "Abbrechen",
          style: "cancel",
        },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            try {
              if (skill?.id) {
                // Delete from backend
                await api.deleteTodoApiV1TodosTodoIdDelete(skill.id);
                // Remove from local store
                removeSkill(skill.id);
                // Navigate back
                router.back();
              }
            } catch (error) {
              console.error("Error deleting skill:", error);
              Alert.alert("Fehler", "Skill konnte nicht gelöscht werden.");
            }
          },
        },
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Skill bearbeiten",
      headerBackTitle: "Zurück",
      headerTitleStyle: { fontWeight: "bold" },
      headerRight: () => (
        <TouchableOpacity
          onPress={handleDeleteSkill}
          style={{
            padding: 8,
            marginRight: 8,
          }}
        >
          <Trash2 size={22} color="#FF3B30" />
        </TouchableOpacity>
      ),
    });
  }, [skill, colors]);

  // Load skill data and populate form
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
        const skillData = response.data;

        setSkill(skillData);

        // Populate form with existing data
        setTitle(skillData.title || "");
        setGoal(skillData.goal || "");
        setColor(skillData.color || "hsl(210, 64%, 62%)");
        setIcon(skillData.icon || "Target");

        // Convert todos to steps
        const todoSteps = skillData.todos?.map((todo) => todo.text) || [];
        setSteps(todoSteps);

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

  // Step management functions
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

  // Save updated skill
  const handleSave = async () => {
    if (!title.trim() || !goal.trim()) {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus.");
      return;
    }

    if (!skill?.id) {
      Alert.alert("Fehler", "Skill ID nicht gefunden.");
      return;
    }

    setIsLoading(true);

    try {
      // Convert steps back to todos, preserving existing todo IDs where possible
      const updatedTodos = steps.map((step, index) => {
        const existingTodo = skill.todos?.[index];
        return {
          text: step.trim(),
          status: existingTodo?.status || false,
          id:
            existingTodo?.id ||
            `todo_${Date.now()}_${index}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
        };
      });

      const updatedSkill = {
        title: title.trim(),
        goal: goal.trim(),
        color: String(color),
        icon,
        user: skill.user,
        textColor: skill.textColor || "#FFFFFF",
        tip: skill.tip || "",
        todos: updatedTodos,
      };

      // Update via API
      const response = await api.updateTodoApiV1TodosTodoIdPut(
        skill.id,
        updatedSkill
      );

      // Update local store
      updateSkill(response.data);

      Alert.alert("Erfolg", "Skill wurde erfolgreich aktualisiert!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Skills:", error);
      Alert.alert("Fehler", "Skill konnte nicht aktualisiert werden.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <Container isHeaderShown={true}>
          <ScrollView
            className="flex-1 gap-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
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

            <SkillPreview title={title} goal={goal} color={color} icon={icon} />

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
              {isLoading ? "Wird aktualisiert..." : "Skill aktualisieren"}
            </Button>
            <View style={{ height: 24 }} />
          </ScrollView>
        </Container>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditSkill;
