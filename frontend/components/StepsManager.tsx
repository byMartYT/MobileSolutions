import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { X, ChevronUp, ChevronDown } from "lucide-react-native";

interface StepsManagerProps {
  steps: string[];
  nextTodo: string;
  onNextTodoChange: (text: string) => void;
  onAddStep: () => void;
  onRemoveStep: (index: number) => void;
  onMoveStepUp: (index: number) => void;
  onMoveStepDown: (index: number) => void;
}

export default function StepsManager({
  steps,
  nextTodo,
  onNextTodoChange,
  onAddStep,
  onRemoveStep,
  onMoveStepUp,
  onMoveStepDown,
}: StepsManagerProps) {
  return (
    <View className="gap-2 mt-4">
      <Text className="text-lg font-semibold text-gray-900">Schritte</Text>
      <TextInput
        value={nextTodo}
        onChangeText={onNextTodoChange}
        placeholder="z.B. Laufschuhe kaufen"
        className="border border-gray-300 rounded-xl p-4 text-base bg-white"
        maxLength={50}
        returnKeyType="done"
        onSubmitEditing={onAddStep}
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
                    onPress={() => onMoveStepUp(index)}
                    disabled={index === 0}
                    className={`p-1 mr-1 ${index === 0 ? "opacity-30" : ""}`}
                  >
                    <ChevronUp size={16} color="#374151" />
                  </Pressable>

                  {/* Move Down Button */}
                  <Pressable
                    onPress={() => onMoveStepDown(index)}
                    disabled={index === steps.length - 1}
                    className={`p-1 mr-2 ${
                      index === steps.length - 1 ? "opacity-30" : ""
                    }`}
                  >
                    <ChevronDown size={16} color="#374151" />
                  </Pressable>

                  {/* Remove Button */}
                  <Pressable
                    onPress={() => onRemoveStep(index)}
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
          <Text className="text-gray-500">Keine Schritte hinzugefügt</Text>
        )}
      </View>
    </View>
  );
}
