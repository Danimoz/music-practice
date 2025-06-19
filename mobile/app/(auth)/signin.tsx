import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Input } from "@/components/Input";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from "@/components/Button";
import { Image } from "expo-image";
import { cssInterop } from 'nativewind';
import { Link } from "expo-router";

cssInterop(Image, {className: "style"})


export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerClassName="h-full p-6 bg-white">
        <View>
          <Text className="text-3xl font-bold text-center mt-8 mb-14">
            Login
          </Text>
          
          <View className="relative mb-8">
            <Ionicons
              name="mail-outline"
              size={24}
              className="absolute top-1/2 left-3 -translate-y-1/2 z-10"
              color="#888"
            />
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              className="pl-14 native:h-14 rounded-2xl border border-primary"
            />
          </View>

          <View className="relative mb-2">
            <Ionicons
              name="lock-closed-outline"
              size={24}
              className="absolute top-1/2 left-3 -translate-y-1/2 z-10"
              color="#888"
            />
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoComplete="password"
              className="pl-14 native:h-14 rounded-2xl border border-primary"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 z-10"
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
              />
            </TouchableOpacity>
          </View>
          {/* Forgot Password */}
          <Link href='/signup' className="mb-14">
            <Text className="text-right text-[#c4c4c4] text-base">Forgot password?</Text>
          </Link>

          {/* Login Button */}
          <Button
            className={`bg-primary rounded-xl items-center shadow-xl mb-8 ${isLoading ? "opacity-70" : ""}`}
            onPress={() => null}
            disabled={isLoading}
            size='lg'
            style={{ elevation: 10 }}
          >
            <Text className="text-xl font-semibold">{isLoading ? "Logging in..." : "Login"}</Text>
          </Button>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mb-12">
            <Text className="text-gray-600 text-sm">Don't have an account? </Text>
            <Link href="/signup" className="ml-1">
              <Text className="text-primary text-base font-semibold"> Sign Up</Text>
            </Link>
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-7">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-5 text-gray-600 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <Button
            className="border border-primary rounded-xl bg-white flex-row"
          >
            <Image 
              source={require("../../assets/icons/GoogleIcon.png")}
              className="w-6 h-6 mr-2"
            />
            <Text className="flex-1 text-base text-center">Sign in with Google</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}