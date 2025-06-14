import { View, Text, Pressable } from "react-native";
import React, { useOptimistic, useState } from "react";
import { TodoItem } from "@/generated";
import { Check } from "lucide-react-native";
import clsx from "clsx";

type Props = {
  todo: TodoItem;
  onStatusChange: (newStatus: boolean) => Promise<void>;
};

const NextTodo = ({ todo, onStatusChange }: Props) => {
  const [status, setStatus] = useState(todo.status);

  const handlePress = async () => {
    const newStatus = !status;

    // Optimistisches Update
    setStatus(newStatus);

    try {
      // Tatsächliches Update im Hintergrund
      await onStatusChange(newStatus);
    } catch (error) {
      // Bei Fehler zurücksetzen
      setStatus(!newStatus);
      console.error("Fehler beim Aktualisieren des Todos:", error);
    }
  };

  return (
    <Pressable
      className="bg-white/30 flex flex-row items-center p-4 gap-3 rounded-xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.3,
        shadowRadius: 14.7,
        elevation: 8,
      }}
      onPress={handlePress}
    >
      <View
        className={clsx(
          "size-7 rounded-lg border-4 flex items-center justify-center",
          status ? "bg-white border-white" : "bg-transparent border-white/80"
        )}
      >
        {status && <Check color="black" size={16} strokeWidth={3} />}
      </View>
      <Text
        className="text-white font-bold flex-shrink flex-wrap"
        numberOfLines={0}
      >
        {todo.text}
      </Text>
    </Pressable>
  );
};

export default NextTodo;
