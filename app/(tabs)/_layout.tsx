import icons from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, Platform, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => (
  <View className="flex-1 mt-1 flex flex-col items-center justify-center min-w-[50px]">
    <Image
      source={icon}
      tintColor={focused ? "#008000" : "#666876"}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${
        focused ? "text-green-700 font-rubik-medium" : "text-black-200 font-rubik"
      } text-[10px] text-center mt-1`}
      numberOfLines={1}
    >
      {title}
    </Text>
  </View>
);

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets(); 

    return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#E0E0E0",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 80 + insets.bottom : 60 + insets.bottom,
          paddingBottom: insets.bottom || 10,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.map} title="Map" />
          ),
        }}
      />
      <Tabs.Screen
        name="plant"
        options={{
          title: "Plant",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.plant} title="Plant" />
          ),
        }}
      />
    </Tabs>
  );
}
