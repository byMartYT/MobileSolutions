import { View, Text } from "react-native";
import React from "react";
import { Todo } from "@/generated";
import ListSkillItemHeader from "./ListSkillItemHeader";
import NextTodo from "./NextTodo";
import { api } from "@/api/api";
import useStore from "@/store/store";

type Props = Todo & {
  handleConfetti: () => void;
};

const ListSkillItem = (data: Props) => {
  const { updateSkill } = useStore();

  const updateTodoStatus = async (
    newStatus: boolean,
    id: string
  ): Promise<void> => {
    await api.updateTodoItemApiV1TodosTodoIdItemsItemIdPatch(data.id!, id, {
      status: newStatus,
    });
    const foundTodo = data.todos.find((todo) => todo.id === id);
    if (!foundTodo) return;

    const updatedTodo = {
      ...foundTodo,
      status: newStatus,
      text: foundTodo.text || "", // Ensure text is never undefined
    };
    updateSkill({
      ...data,
      todos: data.todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
    });
    if (newStatus) {
      data.handleConfetti();
    }
  };

  return (
    <View>
      <ListSkillItemHeader
        text={data.title}
        color={data.color}
        icon={data.icon}
      />
      <View className="flex flex-col gap-4">
        {data.todos.map((todo) => {
          return (
            <NextTodo
              todo={todo}
              key={todo.id}
              onStatusChange={updateTodoStatus}
              onWhite={true}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ListSkillItem;
