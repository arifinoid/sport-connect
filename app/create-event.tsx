import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { createEventStore } from "@/stores/event.store";

export default function CreateEvent() {
  const router = useRouter();
  const { createEvent } = createEventStore();

  const [title, setTitle] = React.useState("");
  const [sport, setSport] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [limit, setLimit] = React.useState("10");
  const [error, setError] = React.useState("");

  const handleSubmit = () => {
    setError("");
    if (!title.trim()) return setError("Title is required");
    if (!sport.trim()) return setError("Sport is required");
    if (!date || !time) return setError("Date and time are required");

    const startTimeISO = new Date(`${date}T${time}:00`).toISOString();
    const nLimit = Math.max(1, parseInt(limit, 10) || 1);

    createEvent({ title: title.trim(), sport: sport.trim(), startTime: startTimeISO, limit: nLimit });
    router.replace("/");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Create Event" }} />
      <View className="flex-1 px-4 pt-20">
        <Card className="rounded-2xl p-4">
          <Text className="mb-3 text-xl font-bold text-foreground">Event details</Text>
          <View className="gap-3">
            <Input value={title} onChangeText={setTitle} placeholder="Title" />
            <Input value={sport} onChangeText={setSport} placeholder="Sport (e.g., tennis)" />
            <Input value={date} onChangeText={setDate} placeholder="Date (YYYY-MM-DD)" />
            <Input value={time} onChangeText={setTime} placeholder="Time (HH:MM, 24h)" />
            <Input value={limit} onChangeText={setLimit} placeholder="Player limit" keyboardType="number-pad" />
            {error ? <Text className="text-destructive">{error}</Text> : null}
            <Button onPress={handleSubmit}>
              <Text>Create</Text>
            </Button>
          </View>
        </Card>
      </View>
    </>
  );
}
