import { useRef, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import { plantProcess } from "@/constants/index";
import { router } from "expo-router";

const Welcome = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const isLastSlide = activeIndex === plantProcess.length - 1;

  const handleSkip = () => router.replace("/guest-or-sign-in");
  const handleNext = () => (isLastSlide ? handleSkip() : carouselRef.current?.next());

  return (
    <SafeAreaView className="flex-1 items-center justify-between bg-white">
      <TouchableOpacity
        onPress={handleSkip}
        className="w-full p-[6vw] items-end"
      >
        <Text className="text-[4vw] font-rubik-medium text-black">Skip</Text>
      </TouchableOpacity>

      <Carousel
        ref={carouselRef}
        loop={false}
        width={Dimensions.get("window").width}
        height={Dimensions.get("window").height * 0.6}
        data={plantProcess}
        scrollAnimationDuration={400}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View className="flex-1 items-center justify-center px-[5vw]">
            <Image
              source={item.image}
              className="w-[80vw] h-[35vh]"
              resizeMode="contain"
            />
            <Text className="text-[6vw] font-bold text-center mt-[3vh] w-[90vw]">
              {item.title}
            </Text>
            <Text className="text-[4vw] text-center text-[#858585] mt-[1.5vh] w-[85vw]">
              {item.description}
            </Text>
          </View>
        )}
        pagingEnabled
      />

      <View className="flex-row justify-center items-center mt-[-1.5vh] mb-[1vh]">
        {plantProcess.map((_, index) => (
          <View
            key={index}
            className={`h-[0.5vh] rounded-full mx-[1vw] ${
              index === activeIndex ? "w-[8vw] bg-primary-300" : "w-[8vw] bg-gray-200"
            }`}
          />
        ))}
      </View>

      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={handleNext}
        className="w-[90vw] py-[4vw] mt-[2vh] rounded-2xl bg-green-800 items-center border border-green-600"
        textStyle="text-white text-[4vw] font-rubik-bold"
      />
    </SafeAreaView>
  );
};

export default Welcome;
