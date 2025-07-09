import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Todo, TodoItem } from "@/generated";
import ProgressBar from "./ProgressBar";
import IconBox from "./IconBox";
import NextTodo from "./NextTodo";
import { api } from "@/api/api";
import useStore from "@/store/store";
import Button from "./Button";
import { BookCheck } from "lucide-react-native";
import { useGamification } from "@/store/gamificationStore";
import { router } from "expo-router";

type SkillItemProps = {
  handleConfetti: () => void;
  completeConfetti: () => void;
  removeSkill: (id: string) => void;
  preview?: boolean;
  notClickable?: boolean;
} & Todo;

const SkillItem = (data: SkillItemProps) => {
  const { updateSkill } = useStore();
  const { completeTask } = useGamification();
  const [nextTodo, setNextTodo] = useState<TodoItem[]>(
    data.todos.filter((todo) => !todo.status)
  );

  // Update nextTodo when data.todos changes (sync with other screens)
  useEffect(() => {
    setNextTodo(data.todos.filter((todo) => !todo.status));
  }, [data.todos]);

  const count = data.todos.filter((item) => item.status).length;
  const total = data.todos.length;

  const updateTodoStatus = async (newStatus: boolean): Promise<void> => {
    if (!nextTodo.length) setNextTodo([]); // Fix: Verhindere Zugriff auf leeres Array
    await api.updateTodoItemApiV1TodosTodoIdItemsItemIdPatch(
      data.id!,
      nextTodo[0].id,
      {
        status: newStatus,
      }
    );
    const updatedTodo = {
      ...nextTodo[0],
      status: newStatus,
    };
    const updatedTodos = data.todos.map((todo) =>
      todo.id === nextTodo[0].id ? updatedTodo : todo
    );

    updateSkill({
      ...data,
      todos: updatedTodos,
    });

    // Update local nextTodo state immediately
    setNextTodo(updatedTodos.filter((todo) => !todo.status));

    // Gamification Integration
    if (newStatus && data.id) {
      // Complete todo task
      await completeTask("todo", nextTodo[0].id);

      // Check if skill is completed and award bonus points
      if (count + 1 === total) {
        await completeTask("skill", data.id);
        data.completeConfetti();
      } else {
        data.handleConfetti();
      }
    } else if (newStatus) {
      // Fallback if no data.id - just show confetti
      if (count + 1 === total) {
        data.completeConfetti();
      } else {
        data.handleConfetti();
      }
    }
  };

  return (
    <Pressable
      className="p-8 rounded-3xl gap-5 relative"
      style={{ backgroundColor: data.color }}
      onPress={() => {
        if (data.notClickable) return;
        router.push(`/${data.id}`);
      }}
    >
      <View className="absolute -top-8 right-6">
        <IconBox icon={data.icon} color={data.color} />
      </View>
      <View>
        <View className="flex-row items-center gap-2">
          {count === total && !data.preview && (
            <BookCheck size={24} color="white" style={{ marginTop: 4 }} />
          )}
          <Text
            className="text-white -mb-1 text-3xl font-semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data.title}
          </Text>
        </View>
      </View>
      <Text className="text-white/80 text-lg font-semibold leading-[1.5]">
        {data.goal}
      </Text>
      <ProgressBar count={count} total={total} />
      {/* Fix: Rende NextTodo nur, wenn nextTodo[0] existiert */}
      {!data.preview &&
        (nextTodo.length > 0 && count !== total ? (
          <NextTodo
            onWhite={false}
            todo={nextTodo[0]}
            onStatusChange={updateTodoStatus}
          />
        ) : (
          <Button onPress={() => data.removeSkill(data.id!)}>Entfernen</Button>
        ))}
    </Pressable>
  );
};

export default SkillItem;
