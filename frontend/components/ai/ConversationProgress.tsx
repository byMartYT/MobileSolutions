import React from "react";
import { View, Text } from "react-native";
import { CheckCircle, Circle } from "lucide-react-native";

interface ConversationProgressProps {
  currentState: string;
  progressPercentage: number;
}

const CONVERSATION_STEPS = [
  {
    key: "collecting_domain",
    label: "Skill-Bereich",
    description: "Was möchtest du lernen?",
  },
  {
    key: "collecting_goals",
    label: "Ziele",
    description: "Was willst du erreichen?",
  },
  {
    key: "collecting_difficulty",
    label: "Erfahrung",
    description: "Dein aktuelles Level",
  },
  {
    key: "collecting_timeframe",
    label: "Zeitrahmen",
    description: "Wann willst du es schaffen?",
  },
  {
    key: "collecting_preferences",
    label: "Präferenzen",
    description: "Persönliche Wünsche",
  },
  {
    key: "generating",
    label: "Generierung",
    description: "AI erstellt deinen Skill",
  },
  { key: "complete", label: "Fertig", description: "Skill ist bereit!" },
];

export default function ConversationProgress({
  currentState,
  progressPercentage,
}: ConversationProgressProps) {
  const getCurrentStepIndex = () => {
    return CONVERSATION_STEPS.findIndex((step) => step.key === currentState);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <View className="bg-white border-b border-gray-200 px-4 py-4">
      {/* Progress Bar */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium text-gray-900">Fortschritt</Text>
          <Text className="text-sm text-gray-500">{progressPercentage}%</Text>
        </View>
        <View className="w-full bg-gray-200 rounded-full h-2">
          <View
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
      </View>

      {/* Current Step */}
      {currentStepIndex >= 0 && (
        <View className="mb-3">
          <Text className="text-sm font-medium text-gray-900 mb-1">
            Aktueller Schritt: {CONVERSATION_STEPS[currentStepIndex].label}
          </Text>
          <Text className="text-xs text-gray-600">
            {CONVERSATION_STEPS[currentStepIndex].description}
          </Text>
        </View>
      )}

      {/* Steps Overview */}
      <ScrollViewHorizontal className="flex-row space-x-3">
        {CONVERSATION_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <View key={step.key} className="items-center min-w-[80px]">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-2 ${
                  isCompleted
                    ? "bg-green-500"
                    : isCurrent
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={16} color="white" />
                ) : (
                  <Text
                    className={`text-xs font-bold ${
                      isCurrent ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                className={`text-xs text-center font-medium ${
                  isCompleted
                    ? "text-green-600"
                    : isCurrent
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </ScrollViewHorizontal>
    </View>
  );
}

// Simple horizontal scroll wrapper
function ScrollViewHorizontal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={className}>{children}</View>;
}
