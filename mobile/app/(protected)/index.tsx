import { Text, View, TouchableOpacity } from "react-native";
import { useGlobalContext } from "@/context/global-provider";

export default function ProtectedHome() {
  const { user, logout } = useGlobalContext();

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-3xl font-bold mb-4">Home</Text>
      {user && (
        <Text className="text-lg mb-8">Welcome, {user.name || user.email}!</Text>
      )}
      <TouchableOpacity
        onPress={logout}
        className="bg-red-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
