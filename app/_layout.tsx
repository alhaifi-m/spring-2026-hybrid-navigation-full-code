import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;

  // OPTION B (cleaner production pattern):
  // Remove app/index.tsx and use this instead of the line above.
  // The Stack will load (tab) directly — no redirect needed.
  //
  // return (
  //   <Stack screenOptions={{ headerShown: false }}>
  //     <Stack.Screen name="(tab)" />
  //   </Stack>
  // );
}
