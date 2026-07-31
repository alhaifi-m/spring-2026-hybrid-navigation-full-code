import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();

  const segments = useSegments();
  // app/index => []
  // app/login => ["login"]
  // app/(tab)/settings/profile.ts => ["(tab)", "seetings", "profile"]
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inTabGroup = segments[0] === "(tab)";
    if (!session && inTabGroup) {
      router.replace("/login");
    } else if (session && !inTabGroup) {
      router.replace("/(tab)/home");
    }
  }, [session, isLoading, segments]);

  if (isLoading) return null;

  return <>{children}</>;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        {/* <Stack screenOptions={{ headerShown: false }} /> */}
        
        <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen name="(tab)"/>
        <Stack.Screen name="login"/>
        <Stack.Screen name="singup"/>
        </Stack>
        
      </AuthGuard>
    </AuthProvider>
  );
}
