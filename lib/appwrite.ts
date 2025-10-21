import { EditableMarker } from "@/components/CustomMap";
import { CreatePlantInput, PlantLocationProps, PlantProps } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";


export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.vsu.medgreen",
    databaseId: '68ef8650003a07cf9d9d',
    plantsCollectionId: 'plants',
    plantLocationsCollectionId: 'plant_locations',
    bucketId: '68ef876b0007fe342dce',
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export async function createAdmin() {
  try {
    return await account.create(
      ID.unique(),
      "admin@admin.com",
      "123123123",
      "Admin"
    );
  } catch (error) {
    throw new Error("Admin user creation failed");
  }
}

export async function loginAdmin(email: string, password: string) {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error("Invalid credentials");
  }
}


export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentAdmin() {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function getPlants({
  query,
  limit,
}: {
  query?: string;
  limit?: number;
}): Promise<PlantProps[]> {
  try {
    const filters: any[] = [Query.orderDesc("$createdAt")];

    if (query && query.trim().length > 0) {
      filters.push(
        Query.or([
          Query.search("name", query.trim()),
          Query.search("scientific_name", query.trim()),
        ])
      );
    }

    if (limit) filters.push(Query.limit(limit));

    const result = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.plantsCollectionId!,
      filters
    );

    return result.documents as unknown as PlantProps[];
  } catch (error) {
    console.error("Error fetching plants:", error);
    return [];
  }
}

export async function getPlantByID({ id }: { id: string }): Promise<PlantProps | null> {
  try {
    const result = await databases.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.plantsCollectionId!,
      id
    );
    return result as unknown as PlantProps;
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    return null;
  }
}


export async function createMedicinalPlant({
  name,
  scientific_name,
  common_name,
  how_to_use,
  informations,
  image_url,
}: CreatePlantInput) {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.plantsCollectionId!,
      ID.unique(),
      {
        name,
        scientific_name,
        common_name: common_name || "",
        how_to_use: how_to_use || "",
        informations: informations || "",
        image_url,
      }
    );

    console.log("Medicinal plant created in Appwrite:", response);
    return response;
  } catch (error) {
    console.error("Error creating medicinal plant:", error);
    throw error;
  }
}

export async function createPlantLocation({
  latitude,
  longitude,
  plant_id,
}: {
  latitude: number;
  longitude: number;
  plant_id: string;
}) {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.plantLocationsCollectionId!,
      ID.unique(),
      {
        latitude,
        longitude,
        plant_id,
      }
    );

    console.log("Plant location created:", response);
    return response;
  } catch (error) {
    console.error("Error creating plant location:", error);
    throw error;
  }
}


export async function getPlantLocations({ id,}: {
  id?: string;
}): Promise<PlantLocationProps[]> {
  try {
    const query = id ? [Query.equal("plant_id", id)] : [];

    const locationsResult = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.plantLocationsCollectionId!,
      query
    );

    const plantsResult = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.plantsCollectionId!
    );

    const plantsMap = Object.fromEntries(
      plantsResult.documents.map((p) => [p.$id, p])
    );

    const mappedLocations: PlantLocationProps[] = locationsResult.documents.map((loc: any) => ({
      $id: loc.$id,
      latitude: loc.latitude,
      longitude: loc.longitude,
      plant_id: plantsMap[loc.plant_id as string] || null,
    }));

    return mappedLocations;
  } catch (error) {
    console.error("Error fetching plant locations:", error);
    return [];
  }
}

export async function deletePlantAndLocations(plantId: string) {
  try {
    const locationDocs = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.plantLocationsCollectionId!,
      [Query.equal("plant_id", plantId)]
    );

    const deletePromises = locationDocs.documents.map((doc) =>
      databases.deleteDocument(appwriteConfig.databaseId!, appwriteConfig.plantLocationsCollectionId!, doc.$id)
    );

    await Promise.all(deletePromises);

    await databases.deleteDocument(appwriteConfig.databaseId!, appwriteConfig.plantsCollectionId!
, plantId);

    console.log(`✅ Deleted plant (${plantId}) and its ${locationDocs.total} location(s).`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting plant and locations:", error);
    return { success: false, error };
  }
}

export async function createPlantWithLocations({
  plantInput,
  locations,
}: {
  plantInput: CreatePlantInput;
  locations: EditableMarker[];
}) {
  try {
    const plant = await createMedicinalPlant(plantInput);

    const locationPromises = locations.map((loc) =>
      createPlantLocation({
        latitude: loc.latitude,
        longitude: loc.longitude,
        plant_id: plant.$id,
      })
    );

    const locationResponses = await Promise.all(locationPromises);

    console.log("Plant with locations created successfully", {
      plant,
      locations: locationResponses,
    });

    return { plant, locations: locationResponses };
  } catch (error) {
    console.error("Error creating plant with locations:", error);
    throw error;
  }
}

export const uploadImageToAppwrite = async (uri: string): Promise<string> => {
  try {
    const file = await storage.createFile(
      appwriteConfig.bucketId!,
      ID.unique(),
      {
        uri,
        type: "image/jpeg",
        name: `plant_${Date.now()}.jpg`,
        size: 0,
      }
    );

    const url = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${file.$id}/view?project=${appwriteConfig.projectId}`;

    console.log("Uploaded file URL:", url);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export async function updateMedicinalPlant(
  plantId: string,
  data: Partial<CreatePlantInput>
) {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.plantsCollectionId!,
      plantId,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating medicinal plant:", error);
    throw error;
  }
}

export async function updatePlantLocations(
  plantId: string,
  newLocations: EditableMarker[]
) {
  try {
    const existing = await getPlantLocations({ id: plantId });

    await Promise.all(
      existing.map((loc) =>
        databases.deleteDocument(
          appwriteConfig.databaseId!,
          appwriteConfig.plantLocationsCollectionId!,
          loc.$id
        )
      )
    );

    await Promise.all(
      newLocations.map((loc) =>
        createPlantLocation({
          latitude: loc.latitude,
          longitude: loc.longitude,
          plant_id: plantId,
        })
      )
    );
  } catch (error) {
    console.error("Error updating plant locations:", error);
    throw error;
  }
}
