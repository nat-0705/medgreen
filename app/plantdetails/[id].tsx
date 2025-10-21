import CustomMap from "@/components/CustomMap";
import FormattedText from "@/components/FormattedText";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getPlantLocations, getPlants } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { PlantLocationProps } from "@/type";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PlantDetails = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const { height, width } = Dimensions.get("window");

  const { data: plants } = useAppwrite({
    fn: getPlants,
    params: { query: "" },
  });

  const { data: rawLocations } = useAppwrite<PlantLocationProps[], { id?: string }>({
    fn: getPlantLocations,
    params: { id: params.id },
  });

  const plant = plants?.find((p) => p.$id === params.id);
  const locations = rawLocations ?? [];

  if (!plant) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-[2vh] text-green-800 text-[4vw]">Loading plant details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-[5vw] py-[2vh] bg-white shadow-md z-50">
        <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center w-[12vw] h-[12vw]">
          <Image source={icons.backArrow} className="w-[6vw] h-[6vw]" />
        </TouchableOpacity>
        <Text className="text-[4.5vw] font-rubik-bold text-black text-center flex-1">
          Plant Details
        </Text>
        <View className="w-[12vw] h-[12vw]" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.15 }}
      >
        <View className="relative w-full" style={{ height: height * 0.45 }}>
          <Image
            source={{ uri: plant.image_url }}
            style={{ width, height: height * 0.45 }}
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full h-[30%] z-40"
            resizeMode="cover"
          />
        </View>

        <View className="px-[5vw] mt-[3vh] flex gap-[2vh]">
          <Text className="text-[6vw] font-rubik-extrabold text-black">{plant.name}</Text>
          <View className="flex flex-row items-center px-[3vw] py-[1.5vw] bg-primary-100 rounded-full w-auto">
            <Text className="text-[4vw] font-rubik-bolditalic text-primary-300">
              {plant.scientific_name}
            </Text>
          </View>

          <View className="mt-[3vh]">
            <View className="flex flex-row items-center gap-[2vw] mb-[1.5vh]">
              <Image source={icons.howToUse} className="w-[7vw] h-[7vw]" />
              <Text className="text-[4.5vw] font-rubik-bold text-gray-700">Common Name</Text>
            </View>
            <FormattedText content={plant.common_name || "N/A"} />
          </View>

          <View className="mt-[3vh]">
            <View className="flex flex-row items-center gap-[2vw] mb-[1.5vh]">
              <Image source={icons.details} className="w-[7vw] h-[7vw]" />
              <Text className="text-[4.5vw] font-rubik-bold text-gray-700">Plant Information</Text>
            </View>
            <FormattedText content={plant.informations || "N/A"} />
          </View>

          <View className="mt-[3vh]">
            <View className="flex flex-row items-center gap-[2vw] mb-[1.5vh]">
              <Image source={icons.howToUse} className="w-[7vw] h-[7vw]" />
              <Text className="text-[4.5vw] font-rubik-bold text-gray-700">How to Use</Text>
            </View>
            <FormattedText content={plant.how_to_use || "N/A"} />
          </View>

          <View className="mt-[3vh] mb-[5vh]">
            <View className="flex flex-row items-center gap-[2vw] mb-[1.5vh]">
              <Image source={icons.location} className="w-[7vw] h-[7vw]" />
              <Text className="text-[4.5vw] font-rubik-bold text-gray-700">Locations</Text>
            </View>

            <View
              className="rounded-2xl overflow-hidden border border-gray-200"
              style={{ height: height * 0.45 }}
            >
              <CustomMap locations={locations} editable={false} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlantDetails;
