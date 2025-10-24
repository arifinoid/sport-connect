import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Link, Stack, useRouter } from "expo-router";
import { MoonStarIcon, SunIcon, PlusIcon, UserIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import * as React from "react";
import { FlatList, View } from "react-native";
import { createEventStore } from "@/stores/event.store";
import { createUserStore } from "@/stores/user.store";

export default function Screen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme()
  const { getUpcomingEvents } = createEventStore();

  const data = React.useMemo(() => getUpcomingEvents(), [getUpcomingEvents]);
  const { getCurrentUser } = createUserStore();
  const user = getCurrentUser();

  return (
    <>
      <Stack.Screen options={{ title: "Sport Connect" }} />
      <View className="flex-1 gap-6 px-4 pt-20 md:pt-24">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-extrabold text-foreground">Upcoming Events</Text>
          </View>

          {user ? <View className="flex-row gap-2">
            <Button onPress={() => router.push("/create-event")} className="ios:h-10 ios:px-4">
              <Icon color={colorScheme === 'dark' ? 'black' : 'white'} as={PlusIcon} className="mr-2 size-4" />
              <Text>Create</Text>
            </Button>
            <Link href="/profile" asChild>
              <Button variant="secondary" className="ios:h-10 ios:px-4">
                <Icon as={UserIcon} className="mr-2 size-4" />
                <Text>Profile</Text>
              </Button>
            </Link>
          </View> : null}
        </View>

        <Separator />

        {data.length === 0 ? (
          <Card className="rounded-2xl p-4">
            <Text className="text-muted-foreground">
              No upcoming events yet. Login and Create to organize one!
            </Text>
          </Card>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item }) => <EventRow eventId={item.id} />}
          />
        )}
      </View>
    </>
  );
}

function EventRow({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { events } = createEventStore();
  const event = events.find((e) => e.id === eventId)!;
  const date = new Date(event.startTime);

  return (
    <Card className="rounded-2xl p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-lg font-bold text-foreground">{event.title}</Text>
          <Text className="text-muted-foreground">
            {event.sport} • {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
          <Text className="text-muted-foreground mt-1">
            Players {event.participants.length}/{event.limit}
          </Text>
        </View>
        <Button onPress={() => router.push(`/event/${event.id}`)}>
          <Text>Details</Text>
        </Button>
      </View>
    </Card>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button onPressIn={toggleColorScheme} size="icon" variant="ghost" className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? "light"]} className="size-5" />
    </Button>
  );
}
