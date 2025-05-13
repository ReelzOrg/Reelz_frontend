import { Stack } from "expo-router";

export default function ProfileStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      <Stack.Screen name="network" /> {/*maybee here is a good idea?*/}
    </Stack>
  );
}