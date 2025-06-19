import { useGlobalContext } from "@/context/global-provider";
import { Redirect, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function ProtectedLayout() {
  const { user, isAuthLoading } = useGlobalContext();

  if (isAuthLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    // If the user is not authenticated, redirect to the sign-in page.
    return <Redirect href="/(auth)/getStarted" />;
  }

  // If the user is authenticated, render the protected routes.
  return <Stack screenOptions={{ headerShown: false }} />;
}