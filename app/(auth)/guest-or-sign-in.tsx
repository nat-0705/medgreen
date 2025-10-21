import { router } from "expo-router";
import { Dimensions, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import images from "@/constants/images";

const GuestOrSignIn = () => {
  const { height } = Dimensions.get("window");

  const onSignInPress = async () => router.replace("/sign-in");
  const onContinueAsGuest = async () => router.replace("/");

  return (
    <SafeAreaView className="bg-white flex-1 items-center justify-between">
      <Image
        source={images.frontPlants}
        className="w-[100vw] h-[45vh]"
        resizeMode="contain"
      />

      <View className="px-[5vw] items-center">
        <Text className="text-[4vw] text-center uppercase font-rubik text-black mt-[2vh]">
          Welcome To MEDGREEN
        </Text>

        <Text className="text-[6vw] font-rubik-bold text-center mt-[1vh] leading-[7vw]">
          Let's Get You Healthy{"\n"}
          <Text className="text-primary-300 font-rubik-bold">
            Using Medicinal Plants
          </Text>
        </Text>
      </View>

      <View className="px-[5vw] w-[100%] mb-[4vh]">
        <CustomButton
          title="Sign-in as Administrator"
          onPress={onSignInPress}
          className="w-[100%] border border-gray-600 py-[3vw] rounded-2xl mt-[2vh] items-center"
          textStyle="text-gray-700 text-[4vw] font-rubik-bold"
        />

        <View className="flex-row items-center my-[3vh]">
          <View className="flex-1 h-[0.2vh] bg-gray-300" />
          <Text className="mx-[2vw] text-gray-500 text-[3.5vw] font-rubik-semibold">
            OR
          </Text>
          <View className="flex-1 h-[0.2vh] bg-gray-300" />
        </View>

        <CustomButton
          title="Continue as Guest"
          onPress={onContinueAsGuest}
          className="w-[100%] border border-green-600 bg-green-800 py-[3vw] rounded-2xl mt-[2vh] items-center"
          textStyle="text-white text-[4vw] font-rubik-bold"
        />
      </View>
    </SafeAreaView>
  );
};

export default GuestOrSignIn;
