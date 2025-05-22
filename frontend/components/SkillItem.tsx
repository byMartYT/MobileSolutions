import { View, Text, Pressable } from "react-native";
import React from "react";
import { Todo, TodoItem } from "@/generated";
import ProgressBar from "./ProgressBar";
import IconBox from "./IconBox";
import NextTodo from "./NextTodo";
import { api } from "@/api/api";
import useStore from "@/store/store";

const SkillItem = (data: Todo) => {
  const { updateSkill } = useStore();
  const [nextTodo, setNextTodo] = React.useState<TodoItem[]>(
    data.todos.filter((todo) => !todo.status)
  );

  const count = data.todos.filter((item) => item.status).length;
  const total = data.todos.length;

  const updateTodoStatus = async (newStatus: boolean): Promise<void> => {
    if (!nextTodo.length) return; // Fix: Verhindere Zugriff auf leeres Array
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
    updateSkill({
      ...data,
      todos: data.todos.map((todo) =>
        todo.id === nextTodo[0].id ? updatedTodo : todo
      ),
    });
  };

  return (
    <Pressable
      className="p-8 rounded-3xl gap-5 relative"
      style={{ backgroundColor: data.color }}
    >
      <View className="absolute -top-8 right-6">
        <IconBox icon={data.icon} color={data.color} />
      </View>
      <Text
        className="text-white -mb-1 text-3xl font-semibold"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {data.title}
      </Text>
      <Text className="text-white/80 text-lg font-semibold leading-[1.5]">
        {data.goal}
      </Text>
      <ProgressBar count={count} total={total} />
      {/* Fix: Rende NextTodo nur, wenn nextTodo[0] existiert */}
      {nextTodo.length > 0 && (
        <NextTodo todo={nextTodo[0]} onStatusChange={updateTodoStatus} />
      )}
    </Pressable>
  );
};

export default SkillItem;
