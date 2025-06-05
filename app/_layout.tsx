import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
