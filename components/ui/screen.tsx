import React from "react";
import { View, Text, ViewProps } from "react-native";

export const Screen: React.FC<ViewProps & { title?: string; scroll?: boolean; showTitle?: boolean }> = ({
  title,
  children,
  showTitle = true,
  ...rest
}) => (
  <View className="flex-1 items-center justify-center gap-8 p-4" {...rest}>
    {title && showTitle ? (
      <Text className="text-2xl font-extrabold text-[#0F172A] dark:text-white my-4">{title}</Text>
    ) : null}
    {children}
  </View>
);
