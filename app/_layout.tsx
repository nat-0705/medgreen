import "@/global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-get-random-values";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "Rubik-BoldItalic": require("../assets/fonts/Rubik-BoldItalic.ttf"),
    "Rubik-Italic": require("../assets/fonts/Rubik-Italic.ttf"),
  });

  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        if (!fontsLoaded) return;

        const logged = await AsyncStorage.getItem("isLogged");
        const isLogged = logged === "true";

        if (isLogged) {
          router.replace("/");
        } else {
          router.replace("/welcome");
        }
      } catch (error) {
        console.warn("Error checking login status:", error);
      } finally {
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  if (!isReady) return null;

  return <Slot />;
}
