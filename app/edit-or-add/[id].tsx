import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomMap, { EditableMarker } from "@/components/CustomMap";
import { editSteps } from "@/constants/editSteps";
import icons from "@/constants/icons";
import { createMedicinalPlant, createPlantLocation, getPlantByID, getPlantLocations, updateMedicinalPlant, updatePlantLocations, uploadImageToAppwrite } from "@/lib/appwrite";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");

export default function EditOrAddPlantScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = id !== "new";
  const carouselRef = useRef<ICarouselInstance>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingEditData, setLoadingEditData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [displayImageUri, setDisplayImageUri] = useState<string | null>(null);
  const [plantLocation, setPlantLocation] = useState<EditableMarker[]>([]);
  const [plantDetails, setPlantDetails] = useState({
    name: "",
    scientificName: "",
    commonName: "",
    informations: "",
    howToUse: "",
    image_url: "",
  });

  const handleChange = (key: string, value: string) => {
    setPlantDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!plantDetails.name.trim()) {
      Alert.alert("Validation Error", "Plant Name is required.");
      return;
    }

    if (!plantDetails.scientificName.trim()) {
      Alert.alert("Validation Error", "Scientific Name is required.");
      return;
    }

    if (!displayImageUri) {
      Alert.alert("Validation Error", "Please upload a plant image.");
      return;
    }

    try {
      setLoadingSubmit(true);
      let uploadedImageUrl: string | undefined;
      if (displayImageUri) {
        uploadedImageUrl = await uploadImageToAppwrite(displayImageUri);
      }

      if (isEditing && id) {
        await updateMedicinalPlant(id, {
          name: plantDetails.name,
          scientific_name: plantDetails.scientificName,
          common_name: plantDetails.commonName,
          how_to_use: plantDetails.howToUse,
          informations: plantDetails.informations,
          image_url: uploadedImageUrl || undefined,
        });

        if (plantLocation.length > 0) {
          await updatePlantLocations(id, plantLocation);
        }

        Alert.alert("Success", "Plant updated successfully!");
      } else {
        const createdPlant = await createMedicinalPlant({
          name: plantDetails.name,
          scientific_name: plantDetails.scientificName,
          common_name: plantDetails.commonName,
          how_to_use: plantDetails.howToUse,
          informations: plantDetails.informations,
          image_url: uploadedImageUrl,
        });

        if (plantLocation.length > 0) {
          await Promise.all(
            plantLocation.map((loc) =>
              createPlantLocation({
                latitude: loc.latitude,
                longitude: loc.longitude,
                plant_id: createdPlant.$id,
              })
            )
          );
        }

        Alert.alert("Success", "Plant created successfully!");
      }

      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while saving the plant.");
    } finally {
      setLoadingSubmit(false);
    }
  };


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setDisplayImageUri(result.assets[0].uri);
  };

  useEffect(() => {
    if (isEditing && id) {
      setLoadingEditData(true);
      (async () => {
        try {
          const plant = await getPlantByID({ id });
          const locations = await getPlantLocations({ id });
          if (!plant) return;

          setPlantDetails({
            name: plant.name || "",
            scientificName: plant.scientific_name || "",
            commonName: plant.common_name || "",
            informations: plant.informations || "",
            howToUse: plant.how_to_use || "",
            image_url: plant.image_url || "",
          });

          const editableLocations = locations.map((loc) => ({
            id: loc.$id,
            latitude: loc.latitude,
            longitude: loc.longitude,
            plant_id: loc.plant_id,
          }));
          setPlantLocation(editableLocations);

          if (plant.image_url) setDisplayImageUri(plant.image_url);
        } catch (err) {
          console.error("Error fetching plant data:", err);
        } finally {
          setLoadingEditData(false);
        }
      })();
    }
  }, [id]);

  if (isEditing && loadingEditData) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-2 text-green-800 text-[4vw]">Loading plant data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white mt-[2vh]">
      <View className="flex-row items-center justify-between px-[5vw] py-[2vh] bg-white">
        <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center w-[10vw] h-[10vw]">
          <Image source={icons.backArrow} className="w-[6vw] h-[6vw]" />
        </TouchableOpacity>
        <Text className="text-[4vw] font-rubik-bold text-black text-center flex-1">
          {isEditing ? "Edit Medicinal Plant" : "Add Medicinal Plant"}
        </Text>
        <View className="w-[10vw] h-[10vw]" />
      </View>

      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={height * 0.75}
        data={editSteps}
        scrollAnimationDuration={400}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View className="px-[5vw] flex-1">
            <View className="w-full">
              <Text className="text-md font-rubik-semibold text-black mb-[1vh]">INSTRUCTIONS</Text>
              {item.instructions.map((instruction, idx) => (
                <Text key={idx} className="text-gray-700 font-rubik text-[3.5vw] pl-4 mb-[1vh]">
                  <Text className="font-rubik-bold">{idx + 1}.</Text> {instruction}
                </Text>
              ))}
            </View>

            {item.key === "name" && (
              <View className="gap-[2vh] bg-white rounded-lg mt-[2vh]">
                <CustomInput
                  label="Plant Name"
                  placeholder="Enter the name..."
                  value={plantDetails.name}
                  onChangeText={(text) => handleChange("name", text)}
                  containerClassName="border border-gray-300 rounded-lg px-4 py-3"
                />
                <CustomInput
                  label="Scientific Name"
                  placeholder="Enter the scientific name..."
                  value={plantDetails.scientificName}
                  onChangeText={(text) => handleChange("scientificName", text)}
                  containerClassName="border border-gray-300 rounded-lg px-4 py-3"
                />
              </View>
            )}

            {item.key === "visuals" && (
              <View className="bg-white rounded-lg mt-[2vh]">
                <TouchableOpacity
                  onPress={pickImage}
                  className="w-full h-[35vw] border border-gray-300 border-dashed rounded-xl justify-center items-center overflow-hidden mb-[3vh]"
                >
                  {displayImageUri ? (
                    <Image source={{ uri: displayImageUri }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <>
                      <Text className="text-md font-rubik-semibold text-black">Plant Image</Text>
                      <Text className="text-gray-500 text-center px-2 text-[3.5vw] font-rubik">Tap to upload</Text>
                    </>
                  )}
                </TouchableOpacity>
                <CustomInput
                  label="Common Name"
                  placeholder={item.placeholder}
                  value={plantDetails.commonName}
                  onChangeText={(text) => handleChange("commonName", text)}
                  containerClassName="w-full border border-gray-300 rounded-lg px-4 py-3"
                  numberOfLines={8}
                />
              </View>
            )}

            {item.key === "info" && (
              <View className="gap-[2vh] bg-white rounded-lg mt-[2vh]">
                <CustomInput
                  label="Information"
                  placeholder={item.placeholder}
                  value={plantDetails.informations}
                  onChangeText={(text) => handleChange("informations", text)}
                  containerClassName="w-full border border-gray-300 rounded-lg px-4 py-3"
                  numberOfLines={8}
                />
              </View>
            )}

            {item.key === "usage" && (
              <View className="gap-[2vh] bg-white rounded-lg mt-[2vh]">
                <CustomInput
                  label="How to Use"
                  placeholder={item.placeholder}
                  value={plantDetails.howToUse}
                  onChangeText={(text) => handleChange("howToUse", text)}
                  containerClassName="w-full border border-gray-300 rounded-lg px-4 py-3"
                  numberOfLines={8}
                />
              </View>
            )}

            {item.key === "location" && (
              <View className="w-full mb-[3vh] flex-1">
                <View className="w-full border border-gray-400 rounded-lg overflow-hidden flex-1" style={{ height: height * 0.5 }}>
                  <CustomMap locations={plantLocation} editable onLocationsChange={(markers) => setPlantLocation(markers)} />
                </View>
              </View>
            )}
          </View>
        )}
      />

      <View className="flex-row justify-center items-center mt-[2vh] mb-[1vh]">
        {editSteps.map((_, index) => (
          <View
            key={index}
            className={`h-[1vw] mx-[1vw] rounded-full ${index === activeIndex ? "w-[8vw] bg-green-700" : "w-[8vw] bg-gray-200"}`}
          />
        ))}
      </View>

      <View className="px-[5vw] mb-[3vh]">
        <CustomButton
          title={activeIndex === editSteps.length - 1 ? "Save" : "Next"}
          onPress={() => (activeIndex === editSteps.length - 1 ? handleSubmit() : carouselRef.current?.next())}
          className={`w-full py-[3vw] rounded-2xl mt-[2vh] items-center bg-green-800`}
          textStyle="text-white font-rubik-bold text-[4vw]"
        />
      </View>

      {loadingSubmit && (
        <View className="absolute inset-0 bg-black/40 z-50 justify-center items-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-white font-rubik-semibold mt-[1vh] text-[4vw]">Saving...</Text>
        </View>
      )}
    </View>
  );
}
