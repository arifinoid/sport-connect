import * as React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useColorScheme } from "nativewind";
import { ChevronLeft, LogOut, MoonStar, Sun } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { createUserStore } from "@/stores/user.store";


export function Header(props: NativeStackHeaderProps) {
  const router = useRouter();
  const nav = useNavigation();
  const canGoBack = nav.canGoBack();

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { getCurrentUser, logout } = createUserStore();
  const user = getCurrentUser();

  const title =
    (props.options && (props.options.title as string)) ||
    (props.route?.name ?? "Sport Connect");

  const handleBack = () => {
    if (canGoBack) router.back();
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View
      className="w-full flex-row items-center justify-between px-3 py-2 md:px-4"
      accessibilityRole="header"
    >
      <View className="flex-row items-center gap-2">
        {canGoBack ? (
          <Button
            variant="ghost"
            size="icon"
            onPressIn={handleBack}
            accessibilityLabel="Go back"
            className="rounded-full ios:size-9"
          >
            <Icon as={ChevronLeft} className="size-5" />
          </Button>
        ) : null}
        <Text className="text-xl font-extrabold text-foreground">{title}</Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Text className="text-muted-foreground">
          {user ? `Logged in as @${user.username}` : "Not logged in"}
        </Text>

        <Button
          onPressIn={toggleColorScheme}
          size="icon"
          variant="ghost"
          className="rounded-full ios:size-9"
          accessibilityLabel="Toggle theme"
        >
          <Icon
            as={colorScheme === "dark" ? MoonStar : Sun}
            className="size-5"
          />
        </Button>

        <Button
          variant="secondary"
          onPress={handleLogout}
          disabled={!user}
          accessibilityLabel="Logout"
        >
          <Icon as={LogOut} className="mr-2 size-4" />
          <Text>Logout</Text>
        </Button>
      </View>
    </View>
  );
}
