import { PlantLocationProps } from "@/type";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { MapPressEvent, Marker, Region } from "react-native-maps";

export interface EditableMarker {
  id: string;
  latitude: number;
  longitude: number;
  plant_id?: string; 

}

type LocationType = PlantLocationProps | EditableMarker;

interface CustomMapProps {
  locations?: LocationType[];
  editable?: boolean;
  initialRegion?: Region;
  onLocationsChange?: (markers: EditableMarker[]) => void;
  onMarkerPress?: (marker: PlantLocationProps) => void;
}

const CustomMap = ({
  locations = [],
  editable = false,
  initialRegion,
  onLocationsChange,
  onMarkerPress,
}: CustomMapProps) => {
  const [markers, setMarkers] = useState<EditableMarker[]>([]);

  useEffect(() => {
    if (editable) {
      const editableMarkers: EditableMarker[] = (locations as PlantLocationProps[]).map((loc) => ({
        id: (loc as any).id || (loc as any).$id || nanoid(),
        latitude: loc.latitude,
        longitude: loc.longitude,
      }));
      setMarkers(editableMarkers);
    }
  }, [locations, editable]);

  const handleMapPress = (e: MapPressEvent) => {
    if (!editable) return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newMarker: EditableMarker = { id: nanoid(), latitude, longitude };
    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
    onLocationsChange?.(updatedMarkers);
  };

  const handleMarkerDragEnd = (id: string, latitude: number, longitude: number) => {
    const updatedMarkers = markers.map((m) =>
      m.id === id ? { ...m, latitude, longitude } : m
    );
    setMarkers(updatedMarkers);
    onLocationsChange?.(updatedMarkers);
  };

  const handleMarkerPress = (id: string) => {
    if (!editable) return;

    Alert.alert(
      "Remove Marker",
      "Do you want to remove this marker?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updatedMarkers = markers.filter((m) => m.id !== id);
            setMarkers(updatedMarkers);
            onLocationsChange?.(updatedMarkers);
          },
        },
      ]
    );
  };

  const region: Region = initialRegion ?? {
    latitude: markers[0]?.latitude || (locations[0] as PlantLocationProps)?.latitude || 10.7392,
    longitude: markers[0]?.longitude || (locations[0] as PlantLocationProps)?.longitude || 124.7944,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
        onPress={handleMapPress}
      >
        {editable
          ? markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                draggable
                onDragEnd={(e) =>
                  handleMarkerDragEnd(
                    marker.id,
                    e.nativeEvent.coordinate.latitude,
                    e.nativeEvent.coordinate.longitude
                  )
                }
                onPress={() => handleMarkerPress(marker.id)}
              />
            ))
          : (locations as PlantLocationProps[]).map((loc) => (
              <Marker
                key={loc.$id}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                title={loc.plant_id?.name || "Unknown Plant"}
                description={loc.plant_id?.scientific_name || ""}
                onPress={() => onMarkerPress?.(loc)}
              />
            ))}
      </MapView>
    </View>
  );
};

export default CustomMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
