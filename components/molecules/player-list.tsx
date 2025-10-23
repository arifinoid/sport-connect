import React from "react";
import { Text, View } from "react-native";
import { VStack } from "@/components/ui/stacks";
import { TextMuted } from "@/components/ui/text-muted"

export const PlayerList: React.FC<{ title: string; users: string[] }> = ({ title, users }) => {
  return (
    <VStack gap={8}>
      <Text style={{ fontSize: 16, fontWeight: "700", color: "#0F172A" }}>{title}</Text>
      {users.length === 0 ? (
        <TextMuted>None</TextMuted>
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {users.map((u) => (
            <View key={u} style={{ backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
              <Text style={{ color: "#0F172A", fontWeight: "600" }}>{u}</Text>
            </View>
          ))}
        </View>
      )}
    </VStack>
  );
};
