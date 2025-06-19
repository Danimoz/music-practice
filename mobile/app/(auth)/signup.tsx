import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useState } from "react";
import { Image } from "expo-image";
import { cssInterop } from 'nativewind';
import { signUpSchema } from "@/lib/schemas";
import { useGlobalContext } from "@/context/global-provider";

cssInterop(Image, {className: "style"})


export default function SignUp() {
 const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const { register } = useGlobalContext();
  const { back } = router;


  async function handleSignUp() {
    // Basic validation
    if (!userData.name || !userData.email || !userData.password || !userData.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    const signupValidation = signUpSchema.safeParse(userData)
    if (!signupValidation.success) {
      const validationErrors = signupValidation.error.flatten().fieldErrors;
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(userData.email, userData.password, userData.name);
      if (res) {
        // Registration successful, navigate to home or login
        alert("Registration successful! Please log in.");
      } else {
        // Handle registration failure
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerClassName="h-full p-6 bg-white">
        {/* Header */}
        <View className="flex-row pt-2.5 pb-5 items-center">
          <TouchableOpacity className="w-6 h-6" onPress={() => back()}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          
          {/* Title */}
          <Text className="flex-1 text-3xl font-bold text-center">
            Sign Up
          </Text>
        </View>

        {/* Form */}
        <View className="mt-9 mb-8">
          <View className="relative">
            <Ionicons
              name="person-outline"
              size={24}
              className="absolute top-1/2 left-3 -translate-y-1/2 z-10"
              color="#888"
            />
            <Input
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              placeholder="Enter your name"
              autoCapitalize="words"
              autoComplete="name"
              className="pl-14 native:h-14 rounded-2xl border border-primary"
            />
          </View>
          {errors?.name && <Text className="text-red-500 mt-1">{errors.name[0]}</Text>}
        </View>

        <View className="mb-8">
          <View className="relative">
            <Ionicons
              name="mail-outline"
              size={24}
              className="absolute top-1/2 left-3 -translate-y-1/2 z-10"
              color="#888"
            />
            <Input
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              className="pl-14 native:h-14 rounded-2xl border border-primary"
            />
          </View>
          {errors?.email && <Text className="text-red-500 mt-1">{errors.email[0]}</Text>}
        </View>

        <View className="mb-8">
          <View className="relative">
            <Ionicons
              name="lock-closed-outline"
              size={24}
              className="absolute top-1/2 left-3 -translate-y-1/2 z-10"
              color="#888"
            />
            <Input
              value={userData.password}
              onChangeText={(text) => setUserData({ ...userData, password: text })}
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
          {errors?.password && <Text className="text-red-500 mt-1">{errors.password[0]}</Text>}
        </View>

        <View className="mb-8">
          <View className="relative">
            <Ionicons
              name="lock-closed-outline"
              size={24}
              className="absolute top-1/2 left-3 -translate-y-1/2 z-10"
              color="#888"
            />
            <Input
              value={userData.confirmPassword}
              onChangeText={(text) => setUserData({ ...userData, confirmPassword: text })}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              className="pl-14 native:h-14 rounded-2xl border border-primary"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 z-10"
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
              />
            </TouchableOpacity>
          </View>
          {errors?.confirmPassword && <Text className="text-red-500 mt-1">{errors.confirmPassword[0]}</Text>}
        </View>
        

        <Button
          className={`bg-primary rounded-xl items-center shadow-xl mb-8 ${isLoading ? "opacity-70" : ""}`}
          onPress={handleSignUp}
          disabled={isLoading}
          size='lg'
          style={{ elevation: 10 }}
        >
          <Text className="text-xl font-semibold">{isLoading ? "Loading..." : "SignUp"}</Text>
        </Button>

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

      </ScrollView>
    </SafeAreaView>
  )
}