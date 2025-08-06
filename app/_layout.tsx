import { Stack } from "expo-router";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdFrequencyManager from "../utils/adManager";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  
  // 앱 실행 시 일일 1회 전면 광고 처리
  useEffect(() => {
    AdFrequencyManager.handleAppLaunch();
  }, []);

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
      <Stack.Screen name="home" />
      <Stack.Screen
        name="addSubscriptionModal"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
