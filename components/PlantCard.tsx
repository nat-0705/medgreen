import { PlantProps } from "@/type";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

interface PlantCardProps {
  plant: PlantProps;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  menuVisible?: boolean;
  setMenuVisible?: (visible: boolean) => void;
  isAdmin?: boolean;
}

export default function PlantCard({
  plant,
  onPress,
  onEdit,
  onDelete,
  menuVisible = false,
  setMenuVisible,
  isAdmin = false,
}: PlantCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="mt-5 mx-auto w-[90%] bg-white rounded-2xl shadow-lg shadow-black/30 p-4 flex-row items-center relative"
      onPress={onPress}
    >
      <View className="w-24 h-20 bg-green-500 rounded-lg overflow-hidden">
        <Image
          source={{ uri: plant?.image_url }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-lg font-rubik-bold text-green-800">
          {plant.name}
        </Text>
        <Text className="font-rubik-italic text-sm text-green-700">
          {plant.scientific_name}
        </Text>
      </View>

      {isAdmin && (
        <View className="relative">
          <TouchableOpacity
            onPress={() => setMenuVisible?.(!menuVisible)}
            hitSlop={10}
          >
            <Entypo name="dots-three-vertical" size={20} color="#2e7d32" />
          </TouchableOpacity>

          {menuVisible && (
            <>
              <Pressable
                className="absolute -top-10 -left-[200px] w-[400px] h-[200px] z-40"
                onPress={() => setMenuVisible?.(false)}
              />
              <View className="absolute right-5 w-28 bg-white border border-gray-200 rounded-lg z-50 shadow-md shadow-black/20 overflow-visible">
                <Pressable
                  className="py-2 px-3 active:bg-gray-100"
                  onPress={() => {
                    setMenuVisible?.(false);
                    onEdit?.();
                  }}
                >
                  <Text className="text-green-700 text-center font-rubik-medium">
                    Edit
                  </Text>
                </Pressable>
                <View className="h-[1px] bg-gray-200" />
                <Pressable
                  className="py-2 px-3 active:bg-gray-100"
                  onPress={() => {
                    setMenuVisible?.(false);
                    onDelete?.();
                  }}
                >
                  <Text className="text-red-600 text-center font-rubik-medium">
                    Delete
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
