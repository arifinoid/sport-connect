import React, { useState } from "react";
import { VStack } from "@/components/ui/stacks";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TextMuted } from "@/components/ui/text-muted"

export type EventFormData = {
  title: string;
  sport: string;
  startTimeISO: string;
  limit: number;
};

type Props = {
  onSubmit: (data: EventFormData) => void;
};

export const EventForm: React.FC<Props> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [time, setTime] = useState(""); // HH:mm
  const [limit, setLimit] = useState("10");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!title.trim()) return setError("Title is required");
    if (!sport.trim()) return setError("Sport is required");
    if (!date || !time) return setError("Date and time are required");

    const startTimeISO = new Date(`${date}T${time}:00`).toISOString();
    const nLimit = Math.max(1, parseInt(limit, 10) || 1);
    onSubmit({ title: title.trim(), sport: sport.trim(), startTimeISO, limit: nLimit });
  };

  return (
    <Card header="Create Event">
      <VStack gap={12}>
        <Input value={title} onChangeText={setTitle} placeholder="Title" accessibilityLabel="title-input" />
        <Input value={sport} onChangeText={setSport} placeholder="Sport (e.g., tennis)" accessibilityLabel="sport-input" />
        <Input value={date} onChangeText={setDate} placeholder="Date (YYYY-MM-DD)" accessibilityLabel="date-input" />
        <Input value={time} onChangeText={setTime} placeholder="Time (HH:MM, 24h)" accessibilityLabel="time-input" />
        <Input value={limit} onChangeText={setLimit} placeholder="Player limit" accessibilityLabel="limit-input" />
        {error ? <TextMuted style={{ color: "#DC2626" }}>{error}</TextMuted> : null}
        <Button onPress={handleSubmit} testID="create-event">Create</Button>
      </VStack>
    </Card>
  );
};
