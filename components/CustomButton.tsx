import { CustomButtonProps } from "@/type";
import cn from "clsx";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const CustomButton = ({
  onPress,
  title = "Click Me",
  className,
  textStyle,
  leftIcon,
  isLoading = false,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className={cn("custom-btn", className)}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-center space-x-2">
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className={cn("font-rubik-semibold text-base", textStyle)}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
