import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { Alert, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { createEventStore } from "@/stores/event.store";
import { createUserStore } from "@/stores/user.store";
import { Event } from "@/types/model.type";

export default function EventDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const events = createEventStore();
  const users = createUserStore();

  const event: Event | undefined = React.useMemo(() => events.events.find((e) => e.id === id), [events.events, id]);
  const current = users.getCurrentUser();

  if (!event) {
    return (
      <>
        <Stack.Screen options={{ title: "Event" }} />
        <View className="flex-1 items-center justify-center px-4 pt-20">
          <Text className="text-muted-foreground">Event not found.</Text>
          <Button variant="ghost" onPress={() => router.back()} className="mt-4">
            <Text>Back</Text>
          </Button>
        </View>
      </>
    );
  }

  const isOrganizer = current?.id === event.organizerId;
  const startDate = new Date(event.startTime);
  const status = events.getJoinStatus(event.id, current?.id ?? "");

  const handleRequest = () => {
    if (!current) return Alert.alert("Please login first");
    events.requestJoin(event.id, current.id);
  };
  const handleCancel = () => {
    if (!current) return Alert.alert("Please login first");
    events.cancelJoinRequest(event.id, current.id);
  };
  const handleAccept = (uid: string) => {
    try {
      events.acceptRequest(event.id, uid, current!.id);
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Unable to accept");
    }
  };
  const handleReject = (uid: string) => {
    try {
      events.rejectRequest(event.id, uid, current!.id);
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Unable to reject");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: event.title }} />
      <View className="flex-1 gap-6 px-4 pt-20">
        <Card className="rounded-2xl p-4">
          <Text className="text-xl font-bold text-foreground">{event.title}</Text>
          <Text className="text-muted-foreground mt-1">Sport: {event.sport}</Text>
          <Text className="text-muted-foreground">
            Starts: {startDate.toLocaleDateString()} • {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
          <Text className="text-muted-foreground">Capacity: {event.participants.length}/{event.limit}</Text>
        </Card>

        <Card className="rounded-2xl p-4">
          <Text className="mb-2 text-base font-semibold text-foreground">Participants</Text>
          {event.participants.length === 0 ? (
            <Text className="text-muted-foreground">None</Text>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {event.participants.map((u) => (
                <View key={u} className="rounded-full bg-secondary px-3 py-1">
                  <Text className="text-foreground">{u}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        {isOrganizer ? (
          <Card className="rounded-2xl p-4">
            <Text className="mb-2 text-base font-semibold text-foreground">Pending requests</Text>
            <Separator className="my-2" />
            {event.pendingRequests.length === 0 ? (
              <Text className="text-muted-foreground">No pending requests</Text>
            ) : (
              <View className="gap-2">
                {event.pendingRequests.map((uid) => (
                  <View key={uid} className="flex-row items-center justify-between">
                    <Text className="font-medium text-foreground">{uid}</Text>
                    <View className="flex-row gap-2">
                      <Button onPress={() => handleAccept(uid)}>
                        <Text>Accept</Text>
                      </Button>
                      <Button variant="secondary" onPress={() => handleReject(uid)}>
                        <Text>Reject</Text>
                      </Button>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
        ) : (
          <Card className="rounded-2xl p-4">
            {status === "none" ? (
              <Button onPress={handleRequest} disabled={event.participants.length === event.limit}>
                <Text>Request to Join</Text>
              </Button>
            ) : status === "pending" ? (
              <Button variant="secondary" onPress={handleCancel}>
                <Text>Cancel Request</Text>
              </Button>
            ) : (
              <Text className="text-muted-foreground">You’ve joined this event 🎉</Text>
            )}
          </Card>
        )}

        <Button variant="ghost" onPress={() => router.replace('/')}>
          <Text>Back to Home</Text>
        </Button>
      </View>
    </>
  );
}
