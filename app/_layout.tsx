import { AuthProvider, useAuth } from "@/utils/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { currentuser, isLoadingUser } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingUser) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!currentuser && !inAuthGroup) {
      router.replace('/auth');
    } else if (currentuser && inAuthGroup) {
      router.replace('/');
    }
  }, [currentuser, isLoadingUser, segments]);

  if (isLoadingUser) return null; // or a splash/loading screen

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthGate>
    </AuthProvider>
  );
}
