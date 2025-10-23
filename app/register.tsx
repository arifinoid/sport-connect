import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { createUserStore } from "@/stores/user.store";

export default function Register() {
  const router = useRouter();
  const { register, login } = createUserStore();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");

  const handleRegister = () => {
    setErr("");
    try {
      register(username, password);
      login(username, password);
      router.replace("/");
    } catch (e: any) {
      setErr(e.message ?? "Register failed");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Register" }} />
      <View className="flex-1 items-center justify-center gap-6 px-4 pt-20">
        <Card className="w-full max-w-xl rounded-2xl p-4">
          <Text className="mb-2 text-xl font-bold text-foreground">Create account</Text>
          <Text className="text-muted-foreground mb-3">It’s quick and easy</Text>
          <View className="gap-3">
            <Input value={username} onChangeText={setUsername} placeholder="Username" accessibilityLabel="reg-username" />
            <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry accessibilityLabel="reg-password" />
            {err ? <Text className="text-destructive">{err}</Text> : null}
            <Button onPress={handleRegister}>
              <Text>Register</Text>
            </Button>
          </View>
          <Separator className="my-4" />
          <Text className="text-muted-foreground text-center">You will be redirected automatically.</Text>
        </Card>
      </View>
    </>
  );
}
