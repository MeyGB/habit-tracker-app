import { AuthProvider, useAuth } from "@/utils/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";


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
    <GestureHandlerRootView style={{flex:1}}>
    <AuthProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <AuthGate>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </AuthGate>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}
