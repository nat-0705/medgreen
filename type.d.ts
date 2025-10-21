import { ImageSourcePropType } from "react-native";
import { Models } from "react-native-appwrite";

/* -----------------------------
 *  🌿 DATABASE TYPES (Appwrite)
 * ----------------------------- */
export interface PlantProps extends Models.Document {
  name: string;
  scientific_name: string;
  image_url?: string;
  informations?: string;
  how_to_use?: string;
  common_name?: string;
}

export interface CreatePlantInput {
  name: string;
  scientific_name: string;
  common_name?: string;
  how_to_use?: string;
  informations?: string;
  image_url?: string;
}

export interface PlantLocationProps {
  $id: string;
  latitude: number;
  longitude: number;
  plant_id?: plant.$id | PlantProps, 
}



/* -----------------------------
 *  👤 USER TYPES
 * ----------------------------- */
export interface User extends Models.Document {
  name: string;
  email: string;
  avatar?: string;
}

/* -----------------------------
 *  🪴 COMPONENT PROPS
 * ----------------------------- */
export interface PlantCardProps {
  plant: Plant;
  onPress?: () => void;
}

export interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}

export interface CustomButtonProps {
  onPress?: () => void;
  title?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  textStyle?: string;
  isLoading?: boolean;
}

export interface CustomHeaderProps {
  title?: string;
}

export interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  containerClassName?: string;
  numberOfLines?: number; 
}

export interface ProfileFieldProps {
  label: string;
  value: string;
  icon: ImageSourcePropType;
}

/* -----------------------------
 *  🔐 AUTH TYPES
 * ----------------------------- */
export interface SignInParams {
  email: string;
  password: string;
}
