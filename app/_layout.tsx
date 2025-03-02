import { mergedStacks } from "@/navigation/ScreenCollection";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{}}>
      {/* <Stack.Screen name="index" /> */}
      <Stack.Screen name="(tabs)" />
      {/* {mergedStacks.map((screen, index) => {
        return (
          <Stack.Screen key={index} name={screen.name} />
        );
      })} */}
    </Stack>
  );
}
