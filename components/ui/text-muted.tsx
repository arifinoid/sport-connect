import React from "react";
import { Text, TextProps } from "react-native";

export const TextMuted: React.FC<TextProps> = ({ style, children, ...rest }) => (
  <Text className="text-slate-500 dark:text-slate-400" style={style} {...rest}>{children}</Text>
);
