import { View, Text, Pressable } from "react-native";
import React from "react";
import { Todo } from "@/generated";
import ProgressBar from "./ProgressBar";
import IconBox from "./IconBox";

const SkillItem = (data: Todo) => {
  const nextTodo = data.todos.find((todo) => !todo.status);

  const count = data.todos.filter((item) => item.status).length;
  const total = data.todos.length;
  return (
    <Pressable
      className="p-8 rounded-3xl gap-5 relative"
      style={{ backgroundColor: data.color }}
    >
      <IconBox icon={data.icon} />
      <Text
        className="text-white -mb-1 leading-none text-3xl font-semibold"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {data.title}
      </Text>
      <Text className="text-white/80 text-lg font-semibold leading-[1.5]">
        {data.goal}
      </Text>
      <ProgressBar count={count} total={total} />
    </Pressable>
  );
};

export default SkillItem;
