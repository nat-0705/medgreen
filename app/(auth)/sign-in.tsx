import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { loginAdmin } from "@/lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      const session = await loginAdmin(email.trim(), password.trim());
      await AsyncStorage.setItem("isLogged", "true");
      await AsyncStorage.setItem("userEmail", email.trim());
      Alert.alert("Success", "You are now signed in!");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const { height } = Dimensions.get("window");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 bg-white">
        <View className={`relative w-full h-[35vh]`}>
          <Image
            source={images.signInPhoto}
            className="w-full h-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full h-full z-40"
          />

          <View className="absolute inset-x-[5vw] z-50" style={{ top: Platform.OS === "ios" ? height * 0.08 : height * 0.05 }}>
            <TouchableOpacity
              onPress={() => router.replace('/guest-or-sign-in')}
              className="w-[12vw] h-[12vw] items-center justify-center rounded-full bg-primary-200"
            >
              <Image source={icons.backArrow} className="w-[6vw] h-[6vw]" />
            </TouchableOpacity>
          </View>

          <Text className="absolute bottom-[2vh] left-[5vw] text-[6vw] text-black font-rubik-semibold">
            Welcome Admin👋
          </Text>
        </View>

        <View className="flex-1 bg-white px-[5vw] py-[3vh] rounded-t-[5vw] justify-start">
          <CustomInput
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <CustomInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            containerClassName="mt-[2vh]"
          />

          <CustomButton
            title="Sign In"
            onPress={handleSignIn}
            className="w-full border border-green-600 bg-green-800 py-[3vw] rounded-2xl mt-[2vh] items-center"
            textStyle="text-white text-[4vw] font-rubik-bold"
            
          />
        </View>
      </View>

      {loading && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center z-50">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-[2vh] font-rubik-semibold text-[4vw]">Signing in...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default SignIn;
