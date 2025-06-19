import { ScrollView, View, Text, Animated, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { cssInterop } from 'nativewind';
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

cssInterop(Image, {className: "style"})
const SplashImage = require("../../assets/images/splashImg.png");
const Logo = require("../../assets/images/Logo1.png");

export default function GetStarted() {
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const { navigate } = useRouter();

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerClassName="h-full">
        <View className="relative h-full">
          <Image 
            source={SplashImage} 
            className="w-full h-full"
            contentFit="cover" 
            transition={1000} 
          />
          <View className="absolute inset-0 flex items-center justify-center bg-black/50 px-6">
            <Image 
              source={Logo} 
              className="w-32 h-32 mb-4"
              contentFit="contain"
              transition={1000}
            />
            <BlurView
              intensity={20}
              tint="dark"
              className="p-3 rounded-2xl border border-white/10"
            >
              <Text className="text-lg text-[#e5e5e5] text-center font-normal leading-6">
                Discover the power of{" "}
                <Text style={{ color: "#FFD700", fontWeight: "600" }}>mindful music practice</Text>
                {"\n"}and achieve your musical goals with focus and calm
              </Text>
            </BlurView>

            <Animated.View
              style={{
                opacity: buttonAnim,
                transform: [
                  { 
                    translateY: buttonAnim.interpolate({  
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }) 
                  }
                ],
              }}
              className="bg-primary px-6 py-3 rounded-lg absolute bottom-10 w-full"
            >
              <TouchableOpacity
                className="rounded-2xl shadow-lg"
                style={{ elevation: 10 }}
                onPress={() => navigate("/(auth)/signin")}
              >
                <Text className="text-lg text-center">Get Started</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
