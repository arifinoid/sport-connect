import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { Header } from "@/components/molecules/header";
import { useEffect, useState } from 'react';
import { createUserStore } from '@/stores/user.store';
import { createEventStore } from '@/stores/event.store';
import { AppState } from 'react-native';
import { useAuthGuard } from '@/hooks/useAuthGuard.hook';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
    const { colorScheme } = useColorScheme();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        let mounted = true;

        (async () => {
            await createUserStore.getState().hydrate();
            await createEventStore.getState().hydrate();
            if (!mounted) return;

            createEventStore.getState().expirePendingRequests();
            setHydrated(true);
        })();

        const sub = AppState.addEventListener("change", (s) => {
            if (s === "active") createEventStore.getState().expirePendingRequests();
        });
        const id = setInterval(() => createEventStore.getState().expirePendingRequests(), 60_000);

        return () => {
            mounted = false;
            clearInterval(id);
            sub.remove();
        };
    }, []);

    useAuthGuard({
        protectedRoutes: ["create-event", "profile", "event"],
        guestRoutes: ["login", "register"],
        enabled: hydrated,
    });

    return (
        <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack
                screenOptions={{
                    header: (props) => <Header {...props} />,
                    headerTransparent: true,
                }}
            />
            <PortalHost />
        </ThemeProvider>
    );
}