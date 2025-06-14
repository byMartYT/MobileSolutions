import { View, Text } from "react-native";
import React from "react";
import { Todo } from "@/generated";
import ListSkillItemHeader from "./ListSkillItemHeader";
import NextTodo from "./NextTodo";

type Props = Todo;

const ListSkillItem = (data: Props) => {
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
              onStatusChange={(id: boolean) => {
                return Promise.resolve();
              }}
              onWhite={true}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ListSkillItem;
