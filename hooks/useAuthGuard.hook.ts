import { useEffect } from "react";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import { createUserStore } from "@/stores/user.store";


export function useAuthGuard({
  protectedRoutes = [],
  guestRoutes = [],
  enabled = true,
}: {
  protectedRoutes?: string[];
  guestRoutes?: string[];
  enabled?: boolean;
}) {
  const router = useRouter();
  const segments = useSegments();
  const navState = useRootNavigationState();

  const { currentUserId, users } = createUserStore.getState();
  const user = users.find((u) => u.id === currentUserId) || null;

  useEffect(() => {
    if (!enabled) return;
    if (!navState?.key) return;
    if (!segments || segments.length < 1) return;

    const top = String(segments[0]);
    const isAuthenticated = !!user;
    const isProtected = protectedRoutes.includes(top);
    const isGuestOnly = guestRoutes.includes(top);

    if (!isAuthenticated && isProtected) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isGuestOnly) {
      router.replace("/");
      return;
    }
  }, [
    enabled,
    navState?.key,
    segments?.join("/"),
    user?.id,
    router,
  ]);
}
