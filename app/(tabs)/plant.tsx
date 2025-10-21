import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EditableMarker } from "@/components/CustomMap";
import PlantCard from "@/components/PlantCard";
import SearchBar from "@/components/SearchBar";
import icons from "@/constants/icons";
import { deletePlantAndLocations, getPlantLocations, getPlants } from "@/lib/appwrite";
import { usePlantStore } from "@/lib/plantStore";
import useAppwrite from "@/lib/useAppwrite";
import { PlantProps } from "@/type";

const Plant = () => {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [plantLocations, setPlantLocations] = useState<EditableMarker[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [isLogged, setIsLogged] = useState(false);

  const { incrementRefresh } = usePlantStore();

  const { data: fetchedPlants, refetch, loading } = useAppwrite({
    fn: getPlants,
    params: { filter: params.filter ?? "All", query: params.query ?? "" },
    skip: false,
  });

  useEffect(() => {
    const checkLogin = async () => {
      const logged = await AsyncStorage.getItem("isLogged");
      setIsLogged(logged === "true");
    };
    checkLogin();
  }, []);

  useEffect(() => { if (fetchedPlants) setPlants(fetchedPlants); }, [fetchedPlants]);

  useEffect(() => {
    refetch({ filter: params.filter ?? "All", query: params.query ?? "" });
  }, [params.query, params.filter]);

  const loadLocations = async () => {
    const locations = await getPlantLocations({ id: undefined });
    setPlantLocations(
      locations.map((loc) => ({
        id: loc.$id,
        latitude: loc.latitude,
        longitude: loc.longitude,
        plant_id: loc.plant_id,
      }))
    );
  };

  useEffect(() => { loadLocations(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch({ filter: params.filter ?? "All", query: params.query ?? "" });
    await loadLocations();
    setRefreshing(false);
  };

  const handleEditOrAdd = (plantId: string) => {
    router.push({ pathname: "/edit-or-add/[id]", params: { id: plantId } });
  };

  const handleDelete = (plantId: string) => {
    Alert.alert(
      "Delete Plant",
      "Are you sure you want to delete this plant?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const result = await deletePlantAndLocations(plantId);

              if (result.success) {
                await refetch({ filter: params.filter ?? "All", query: params.query ?? "" });
                await loadLocations();
                incrementRefresh();
                Alert.alert("Success", "Plant deleted successfully.");
              } else {
                Alert.alert("Error", "Failed to delete the plant. Try again.");
              }
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Something went wrong during deletion.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-[5vw] pb-[2vh] bg-white">
        <View className="flex-row items-center justify-between mt-[3vh]">
          <Image source={icons.logoSmall} className="w-[12vw] h-[12vw]" resizeMode="contain" />
          <Text className="text-[5vw] font-rubik-bold text-green-800 flex-1 text-center">
            Medicinal Plants
          </Text>
          <Image source={icons.logoSmall} className="w-[12vw] h-[12vw]" resizeMode="contain" />
        </View>

        <SearchBar />
      </View>

      <FlatList
        data={plants}
        renderItem={({ item }: any) => (
          <PlantCard
            plant={item}
            onPress={() => router.push(`/plantdetails/${item.$id}`)}
            onEdit={() => isLogged && handleEditOrAdd(item.$id)}
            onDelete={() => isLogged && handleDelete(item.$id)}
            menuVisible={menuVisibleId === item.$id && isLogged}
            setMenuVisible={(visible) => setMenuVisibleId(isLogged && visible ? item.$id : null)}
            isAdmin={isLogged}
          />
        )}
        keyExtractor={(item: any) => item.$id}
        contentContainerClassName="pb-[10vh] px-[5vw]"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="mt-[5vh]" color="#22c55e" />
          ) : (
            <Text className="text-center text-gray-500 mt-[5vh] font-rubik text-[4vw]">
              No plants found.
            </Text>
          )
        }
      />

      {isLogged && (
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/edit-or-add/[id]", params: { id: "new" } })}
          className="absolute bottom-[4vh] right-[4vw] w-[16vw] h-[16vw] bg-green-800 rounded-full flex items-center justify-center shadow-lg"
        >
          <Text className="text-white text-[7vw] font-rubik-bold">+</Text>
        </TouchableOpacity>
      )}

      {deleting && (
        <View className="absolute inset-0 bg-black/20 justify-center items-center z-50">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="mt-[2vh] text-white font-rubik-semibold text-[4vw]">
            Deleting the plant...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Plant;
