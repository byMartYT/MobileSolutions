import { View, Text, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import clsx from "clsx";

const ProgressBar = ({ count, total }: { count: number; total: number }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const progressPercentage = total > 0 ? (count / total) * 100 : 0;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressPercentage,
      duration: 400, // 400ms Animation - kürzer für snappier feel
      useNativeDriver: false, // width kann nicht mit native driver animiert werden
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0), // ease-in-out
    }).start();
  }, [progressPercentage, animatedWidth]);

  return (
    <View className="flex-1 flex flex-row items-center gap-3">
      <View className="flex-1 overflow-hidden h-[5px] bg-white/30 rounded-full">
        <Animated.View
          className={clsx("h-full bg-white rounded-full")}
          style={{
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
              extrapolate: "clamp",
            }),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 19,
            elevation: 4,
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
