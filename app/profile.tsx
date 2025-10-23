import { Stack } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { createEventStore } from "@/stores/event.store";
import { createUserStore } from "@/stores/user.store";

export default function Profile() {
  const { events } = createEventStore();
  const { getCurrentUser } = createUserStore();
  const user = getCurrentUser();

  const created = React.useMemo(() => events.filter((e) => e.organizerId === user?.id), [events, user?.id]);
  const joined = React.useMemo(() => events.filter((e) => e.participants.includes(user?.id ?? "")), [events, user?.id]);

  return (
    <>
      <Stack.Screen options={{ title: "Profile" }} />
      <View className="flex-1 gap-6 px-4 pt-20">
        {!user ? (
          <Text className="text-muted-foreground">Please login to view profile</Text>
        ) : (
          <>
            <Card className="rounded-2xl p-4">
              <Text className="mb-2 text-base font-semibold text-foreground">@{user.username}</Text>
              <Text className="text-muted-foreground">Organizer & player</Text>
            </Card>

            <Card className="rounded-2xl p-4">
              <Text className="mb-2 text-base font-semibold text-foreground">Created</Text>
              {created.length === 0 ? (
                <Text className="text-muted-foreground">None</Text>
              ) : (
                created.map((e) => <Text key={e.id}>{e.title}</Text>)
              )}
            </Card>

            <Card className="rounded-2xl p-4">
              <Text className="mb-2 text-base font-semibold text-foreground">Joined</Text>
              {joined.length === 0 ? (
                <Text className="text-muted-foreground">None</Text>
              ) : (
                joined.map((e) => <Text key={e.id}>{e.title}</Text>)
              )}
            </Card>
          </>
        )}
      </View>
    </>
  );
}
