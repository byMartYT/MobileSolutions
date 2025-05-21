import { View, Text } from "react-native";
import React from "react";
import clsx from "clsx";

const ProgressBar = ({ count, total }: { count: number; total: number }) => {
  console.log(count, total);
  return (
    <View className="flex-1 flex flex-row items-center gap-3">
      <View className="flex-1 overflow-hidden h-[5px] bg-white/30 rounded-full">
        <View
          className={clsx(
            "h-full bg-white rounded-full shadow-[0_0_19px_rgba(0,0,0,0.25)]"
          )}
          style={{
            width: `${(count / total) * 100}%`,
          }}
        />
      </View>
      <Text className="text-white shrink-0 font-semibold">
        {count}/{total}
      </Text>
    </View>
  );
};

export default ProgressBar;
