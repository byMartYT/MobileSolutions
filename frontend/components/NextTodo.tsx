import { View, Text, Pressable } from "react-native";
import Checkbox from "expo-checkbox";
import React, { useOptimistic, useState } from "react";
import { TodoItem } from "@/generated";

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
    <Pressable className="bg-white/30 flex flex-row">
      <Checkbox value={status} onValueChange={handlePress} />
      <Text>{todo.text}</Text>
    </Pressable>
  );
};

export default NextTodo;
