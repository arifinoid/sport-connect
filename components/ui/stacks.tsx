import React from "react";
import { View, ViewProps } from "react-native";

export const HStack: React.FC<ViewProps & { gap?: number }> = ({ style, children, gap = 8, ...rest }) => (
  <View style={[{ flexDirection: "row", gap }, style]} {...rest}>{children}</View>
);

export const VStack: React.FC<ViewProps & { gap?: number }> = ({ style, children, gap = 8, ...rest }) => (
  <View style={[{ flexDirection: "column", gap }, style]} {...rest}>{children}</View>
);
