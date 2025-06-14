import { View, Text, Pressable } from "react-native";
import React, { useOptimistic, useState } from "react";
import { TodoItem } from "@/generated";
import { Check } from "lucide-react-native";
import clsx from "clsx";

type Props = {
  todo: TodoItem;
  onWhite?: boolean;
  onStatusChange: (newStatus: boolean, id: string) => Promise<void>;
};

const NextTodo = ({ todo, onStatusChange, onWhite = false }: Props) => {
  const [status, setStatus] = useState(todo.status);

  const handlePress = async () => {
    const newStatus = !status;

    // Optimistisches Update
    setStatus(newStatus);

    try {
      // Tatsächliches Update im Hintergrund
      await onStatusChange(newStatus, todo.id);
    } catch (error) {
      // Bei Fehler zurücksetzen
      setStatus(!newStatus);
      console.error("Fehler beim Aktualisieren des Todos:", error);
    }
  };

  return (
    <Pressable
      className={clsx(
        "flex flex-row items-center p-4 gap-3 rounded-xl",
        !onWhite ? "bg-white/30" : "bg-white"
      )}
      style={
        !onWhite && {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.3,
          shadowRadius: 14.7,
          elevation: 8,
        }
      }
      onPress={handlePress}
    >
      <View
        className={clsx(
          "rounded-lg flex items-center justify-center",
          !onWhite ? "border-4 size-7" : "border-2 size-6",
          !onWhite
            ? status
              ? "bg-white border-white"
              : "bg-transparent border-white/80"
            : status
            ? "bg-black border-black"
            : "bg-transparent border-black"
        )}
      >
        {status && (
          <Check
            color={!onWhite ? "black" : "white"}
            size={16}
            strokeWidth={3}
          />
        )}
      </View>
      <Text
        className={clsx(" flex-1", !onWhite ? "text-white" : "text-black")}
        numberOfLines={0}
      >
        {todo.text}
      </Text>
    </Pressable>
  );
};

export default NextTodo;
