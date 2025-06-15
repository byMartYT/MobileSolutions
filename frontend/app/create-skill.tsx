import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft,
  Save,
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
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react-native";
import Container from "@/components/Container";
import { api } from "@/api/api";
import useStore from "@/store/store";
import clsx from "clsx";
import SkillItem from "@/components/SkillItem";
import { v4 as uuidv4 } from "uuid";
import Button from "@/components/Button";

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
        color: String(color), // Convert to string to ensure it's properly serialized
        icon,
        user: "default-user",
        textColor: "#FFFFFF", // Default white text
        tip: "", // Optional tip field
        todos: todos,
      };
    } catch (objError) {
      setIsLoading(false);
      return;
    }

    try {
      // API Call zum Erstellen des Skills
      const response = await api.createTodoApiV1TodosPost(newSkill);
      // Lokalen Store aktualisieren
      addSkill(response.data);

      // Zurück zur Skills-Übersicht
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
              {/* Title Input */}
              <View className="gap-2">
                <Text className="text-lg font-semibold text-gray-900">
                  Welchen Skill möchtest du lernen?
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
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
                  onChangeText={setGoal}
                  placeholder="Beschreiben Sie Ihr Lernziel..."
                  multiline
                  numberOfLines={4}
                  className="border border-gray-300 rounded-xl p-4 text-base bg-white"
                  textAlignVertical="top"
                  maxLength={200}
                />
              </View>

              {/* Color Selection */}
              <View className="gap-2">
                <Text className="text-lg font-semibold text-gray-900">
                  Farbe wählen
                </Text>
                <View className="flex-row gap-3 flex-wrap justify-start">
                  {predefinedColors.map((colorOption) => {
                    return (
                      <Pressable
                        key={colorOption}
                        onPress={() => setColor(colorOption)}
                        className={clsx(
                          "rounded-xl mb-3",
                          color === colorOption && "border-4 border-gray-800"
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

              {/* Icon Selection */}
              <View className="gap-2">
                <Text className="text-lg font-semibold text-gray-900">
                  Icon wählen
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {predefinedIcons.map((iconOption) => {
                    const IconComponent = iconOption.component;
                    return (
                      <Pressable
                        key={iconOption.name}
                        onPress={() => setIcon(iconOption.name)}
                        className={`relative rounded-xl items-center justify-center`}
                        style={{
                          paddingBottom: 8,
                        }}
                      >
                        <IconComponent size={44} color="#374151" />
                        {icon === iconOption.name && (
                          <View
                            style={{
                              backgroundColor: color,
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

              {/* Preview */}
              <View className="gap-2 mt-4">
                <Text className="text-lg font-semibold text-gray-900">
                  Vorschau
                </Text>
                <SkillItem
                  color={color}
                  title={title}
                  handleConfetti={() => {}}
                  completeConfetti={() => {}}
                  removeSkill={() => {}}
                  icon={icon}
                  user="default-user"
                  textColor="#FFFFFF"
                  tip=""
                  goal={goal}
                  todos={[]}
                  preview={true}
                />
              </View>

              <View className="gap-2 mt-4">
                <Text className="text-lg font-semibold text-gray-900">
                  Schritte
                </Text>
                <TextInput
                  value={nextTodo}
                  onChangeText={setNextTodo}
                  placeholder="z.B. Laufschuhe kaufen"
                  className="border border-gray-300 rounded-xl p-4 text-base bg-white"
                  maxLength={50}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    setSteps([...steps, nextTodo]);
                    setNextTodo("");
                  }}
                />
                <View>
                  {steps.length > 0 ? (
                    <View className="mt-2">
                      {steps.map((step, index) => (
                        <View
                          key={index}
                          className="flex-row items-center justify-between p-2 bg-gray-100 rounded-lg mb-2"
                        >
                          <Text className="text-gray-800 flex-1">{step}</Text>

                          <View className="flex-row gap-3 items-center">
                            {/* Move Up Button */}
                            <Pressable
                              onPress={() => moveStepUp(index)}
                              disabled={index === 0}
                              className={`p-1 mr-1 ${
                                index === 0 ? "opacity-30" : ""
                              }`}
                            >
                              <ChevronUp size={16} color="#374151" />
                            </Pressable>

                            {/* Move Down Button */}
                            <Pressable
                              onPress={() => moveStepDown(index)}
                              disabled={index === steps.length - 1}
                              className={`p-1 mr-2 ${
                                index === steps.length - 1 ? "opacity-30" : ""
                              }`}
                            >
                              <ChevronDown size={16} color="#374151" />
                            </Pressable>

                            {/* Remove Button */}
                            <Pressable
                              onPress={() =>
                                setSteps(steps.filter((_, i) => i !== index))
                              }
                              className="p-1 rounded-full items-center justify-center"
                              style={{
                                backgroundColor: "#FF000050",
                                height: 24,
                                width: 24,
                              }}
                            >
                              <Text className="text-white">
                                <X color={"white"} size={16} strokeWidth={3} />
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text className="text-gray-500">
                      Keine Schritte hinzugefügt
                    </Text>
                  )}
                </View>
              </View>

              {/* Save Button */}
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
