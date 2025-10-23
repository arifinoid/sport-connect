import { Link, Stack, useRouter } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { createUserStore } from "@/stores/user.store";


export default function Login() {
  const router = useRouter();
  const { login } = createUserStore();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");

  const handleLogin = () => {
    setErr("");
    try {
      login(username, password);
      router.replace("/");
    } catch (e: any) {
      setErr(e.message ?? "Login failed");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <View className="flex-1 items-center justify-center gap-6 px-4 pt-20">
        <Card className="w-full max-w-xl rounded-2xl p-4">
          <Text className="mb-2 text-xl font-bold text-foreground">Welcome back</Text>
          <Text className="text-muted-foreground mb-3">Sign in to continue</Text>
          <View className="gap-3">
            <Input value={username} onChangeText={setUsername} placeholder="Username" accessibilityLabel="username" />
            <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry accessibilityLabel="password" />
            {err ? <Text className="text-destructive">{err}</Text> : null}
            <Button onPress={handleLogin}>
              <Text>Login</Text>
            </Button>
          </View>
          <Separator className="my-4" />
          <View className="flex-row items-center gap-2">
            <Text className="text-muted-foreground">New here?</Text>
            <Link href="/register">
              <Text className="text-primary font-semibold">Create an account</Text>
            </Link>
          </View>
        </Card>
      </View>
    </>
  );
}
