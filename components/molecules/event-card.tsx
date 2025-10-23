// src/components/event-card.tsx
import React from "react";
import { Text } from "react-native";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HStack, VStack } from "@/components/ui/stacks";
import { TextMuted } from "@/components/ui/text-muted";
import type { Event } from "@/types/model.type";

type Props = {
  event: Event;
  onPressDetails: () => void;
};

export const EventCard: React.FC<Props> = ({ event, onPressDetails }) => {
  const date = new Date(event.startTime);
  return (
    <Card className="bg-card dark:bg-[#101826] border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
      <VStack gap={6}>
        <HStack className="justify-between items-center">
          <Text className="text-lg font-bold text-slate-900 dark:text-white">{event.title}</Text>
          <TextMuted>{event.sport}</TextMuted>
        </HStack>
        <TextMuted>
          {date.toLocaleDateString()} • {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </TextMuted>
        <TextMuted>Players: {event.participants.length}/{event.limit}</TextMuted>
        <HStack gap={12}>
          <Button onPress={onPressDetails} accessibilityLabel={`details-${event.title}`}>Details</Button>
        </HStack>
      </VStack>
    </Card>
  );
};
