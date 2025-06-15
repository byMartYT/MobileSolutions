import { View, Text } from "react-native";
import React from "react";
import { Todo } from "@/generated";
import ListSkillItemHeader from "./ListSkillItemHeader";
import NextTodo from "./NextTodo";
import { api } from "@/api/api";
import useStore from "@/store/store";
import { useGamification } from "@/store/gamificationStore";

type Props = Todo & {
  handleConfetti: () => void;
};

const ListSkillItem = (data: Props) => {
  const { updateSkill } = useStore();

  const { completeTask, awardPoints, stats, fetchData } = useGamification();

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

    // Update the local state
    const updatedSkill = {
      ...data,
      todos: data.todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
    };
    updateSkill(updatedSkill);

    // Gamification Integration
    if (newStatus && data.id) {
      // Complete todo task
      await completeTask("todo", id);

      // Check if skill is completed (all todos done)
      const completedTodos = updatedSkill.todos.filter(
        (todo) => todo.status
      ).length;
      const totalTodos = updatedSkill.todos.length;

      if (completedTodos === totalTodos && totalTodos > 0) {
        // Skill completed - award bonus points
        await completeTask("skill", data.id);
        console.log("🎯 SKILL COMPLETED:", data.title);
      }

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
