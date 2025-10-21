import CustomButton from "@/components/CustomButton";
import CustomMap from "@/components/CustomMap";
import { getPlantLocations } from "@/lib/appwrite";
import { usePlantStore } from "@/lib/plantStore";
import useAppwrite from "@/lib/useAppwrite";
import { PlantLocationProps } from "@/type";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Text, View } from "react-native";

const MapScreen = () => {
  const [selectedPlant, setSelectedPlant] = useState<PlantLocationProps | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { refreshKey } = usePlantStore();

  const { data: locations, loading, refetch } = useAppwrite<PlantLocationProps[], {}>({
    fn: getPlantLocations,
    params: {},
  });

  useEffect(() => {
    refetch({});
  }, [refreshKey]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-2 text-green-800 font-rubik-semibold">
          Loading plant locations...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CustomMap
        locations={locations ?? []}
        editable={false}
        onMarkerPress={(plant) => {
          setSelectedPlant(plant);
          setModalVisible(true);
        }}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-4 rounded-2xl w-[90%] shadow-lg">
            <Image
              source={{ uri: selectedPlant?.plant_id?.image_url }}
              className="w-full h-40 rounded-lg"
              resizeMode="cover"
            />
            <Text className="text-lg font-rubik-bold text-green-800 mt-3">
              {selectedPlant?.plant_id?.name}
            </Text>
            <Text className="text-sm font-rubik-italic text-green-700">
              {selectedPlant?.plant_id?.scientific_name}
            </Text>
            <CustomButton
              title="View Details"
              onPress={() => {
                setModalVisible(false);
                router.push(`/plantdetails/${selectedPlant?.plant_id?.$id}`);
              }}
              className="w-full border border-green-600 bg-green-800 py-4 rounded-2xl mt-5 items-center font-rubik-bold"
              textStyle="text-white"
            />
            <CustomButton
              title="Cancel"
              onPress={() => setModalVisible(false)}
              className="w-full bg-gray-500 py-2 rounded-2xl mt-2 items-center font-rubik-bold"
              textStyle="text-white"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;
