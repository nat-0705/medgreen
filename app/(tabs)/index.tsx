import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CustomButton from "@/components/CustomButton";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { account, getPlants } from "@/lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const logged = await AsyncStorage.getItem("isLogged");
      setIsLogged(logged === "true");
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setModalVisible(false);
            await account.deleteSession("current").catch(() => {});
            await AsyncStorage.removeItem("isLogged");
            await AsyncStorage.removeItem("userEmail");
            setIsLogged(false);
            router.replace("/guest-or-sign-in");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onBackPress = () => router.replace("/guest-or-sign-in");

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Please allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      sendImageToHuggingFace(uri);
    }
  };

  const sendImageToHuggingFace = async (imageUri: string) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "plant.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch(
        `https://nat0705-medicinal-plant-api.hf.space/predict`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        setPredictionData({ error: data.error });
      } else {
        const plants = await getPlants({ query: data.plant, limit: 1 });
        setPredictionData({
          plant: data.plant,
          confidence: data.confidence,
          found: plants.length > 0,
          plantId: plants.length > 0 ? plants[0].$id : null,
        });
      }

      setModalVisible(true);
    } catch (error) {
      setLoading(false);
      setPredictionData({ error: "Failed to connect to the Hugging Face server." });
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-[5vw] pt-[5vh] pb-[2vh] flex-row justify-between items-center">
        {!isLogged ? (
          <TouchableOpacity className="p-[2vw]" onPress={onBackPress}>
            <Image
              source={icons.backArrow}
              className="w-[6vw] h-[6vw]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View className="w-[6vw]" />
        )}

        {isLogged && (
          <TouchableOpacity className="p-[2vw]" onPress={handleLogout}>
            <Image
              source={icons.logout}
              className="w-[7vw] h-[7vw]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      <View className="items-center mt-[4vh]">
        <Image
          source={images.logo}
          className="w-[60vw] h-[20vh]"
          resizeMode="contain"
        />
      </View>

      <View className="bg-white mx-[5vw] mt-[4vh] rounded-[8vw] p-[4vw] shadow-md items-center">
        <Text className="text-green-800 text-[4vw] font-rubik-bold text-center">
          Discover the Medicinal Plants
        </Text>

        <View className="flex-row items-center justify-between mt-[4vh] w-full">
          <Image source={images.qr} className="w-[12vw] h-[12vw]" resizeMode="contain" />
          <Image source={images.next} className="w-[5vw] h-[9vw]" resizeMode="contain" />
          <Image source={images.paper} className="w-[14vw] h-[14vw]" resizeMode="contain" />
          <Image source={images.next} className="w-[5vw] h-[9vw]" resizeMode="contain" />
          <Image source={images.healthcare} className="w-[14vw] h-[14vw]" resizeMode="contain" />
        </View>

        <CustomButton
          title="Take a Photo"
          onPress={openCamera}
          className="w-full border border-green-600 bg-green-800 py-[3vw] rounded-2xl mt-[4vh] items-center font-rubik-bold"
          leftIcon={
            <Image source={icons.photography} className="w-[5vw] h-[5vw]" />
          }
          textStyle="text-white text-[4vw]"
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-4 rounded-2xl w-[90%] shadow-lg items-center">
            {predictionData?.error ? (
              <>
                <Text className="text-lg font-rubik-bold text-red-600">
                  Prediction Error
                </Text>
                <Text className="text-sm text-center mt-2 text-gray-600">
                  {predictionData.error}
                </Text>
                <CustomButton
                  title="Close"
                  onPress={() => setModalVisible(false)}
                  className="w-full bg-gray-600 py-3 rounded-2xl mt-5 items-center"
                  textStyle="text-white font-rubik-semibold"
                />
              </>
            ) : (
              <>
                {image && (
                  <Image
                    source={{ uri: image }}
                    className="w-full h-40 rounded-lg"
                    resizeMode="cover"
                  />
                )}
                <Text className="text-lg font-rubik-bold text-green-800 mt-3">
                  {predictionData?.plant?.toUpperCase()}
                </Text>
                <Text className="text-sm font-rubik-italic text-green-700">
                  Probability Rate: {predictionData?.confidence?.toFixed(2)}%
                </Text>

                {predictionData?.found ? (
                  <CustomButton
                    title="View Details"
                    onPress={() => {
                      setModalVisible(false);
                      router.push(`/plantdetails/${predictionData.plantId}`);
                    }}
                    className="w-full border border-green-600 bg-green-800 py-4 rounded-2xl mt-5 items-center"
                    textStyle="text-white font-rubik-bold"
                  />
                ) : (
                  <Text className="text-sm text-red-600 mt-4 text-center">
                    The predicted plant does not exist in the database.
                  </Text>
                )}

                <CustomButton
                  title="Close"
                  onPress={() => setModalVisible(false)}
                  className="w-full bg-gray-500 py-2 rounded-2xl mt-2 items-center"
                  textStyle="text-white"
                />
              </>
            )}
          </View>
        </View>
      </Modal>

      {loading && (
        <View className="absolute inset-0 bg-black/50 z-50 items-center justify-center">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-[2vh] font-rubik-semibold text-[4vw]">
            Processing Image...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
