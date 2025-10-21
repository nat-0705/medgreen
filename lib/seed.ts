import { createMedicinalPlant, createPlantLocation } from "./appwrite";

export const seedPlantsAndLocations = async () => {
  try {
    const plants = [
      {
        name: "Acapulco",
        scientific_name: "Cassia alata",
        common_name: "- **Akapulko**\n- **Ringworm Bush**",
        informations:
          "**Acapulco** (*Cassia alata*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
        how_to_use:
          "- **Tea/Infusion:** Turmeric can be brewed as a tea to help with digestion and inflammation. It is often combined with black pepper to improve curcumin absorption.\n- **Topical:** Turmeric powder can be mixed with water or milk to create a paste and applied to the skin for wound healing or skin brightening.\n- **Culinary:** Turmeric is a key ingredient in many Indian and Southeast Asian dishes, especially in curries, rice dishes, and soups. It adds both flavor and a bright yellow color to foods.\n- **Supplement:** Turmeric is available in capsules or tablets for internal use to manage inflammation or digestive issues.",
        image_url:
          "https://fra.cloud.appwrite.io/v1/storage/buckets/68d2c5d40002165225e5/files/68ef2ee30031229556f9/view?project=68d2c288002f18043976&mode=admin",
      },
      {
        name: "Basil",
        scientific_name: "Ocimum basilicum",
        common_name: "- **Sweet Basil**",
        informations:
          "**Basil** (*Ocimum basilicum*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
        how_to_use:
          "- **Tea/Infusion:** Fresh basil leaves can be brewed into tea to help with digestion and reduce stress.\n- **Topical:** Basil oil can be used topically for skin infections or as an insect repellent.\n- **Culinary:** Fresh or dried basil is commonly used in cooking, especially in Mediterranean and Southeast Asian cuisines.\n- **Supplement:** Basil extract supplements are available and may help in managing blood sugar levels and providing antioxidant support.",
        image_url:
          "https://fra.cloud.appwrite.io/v1/storage/buckets/68d2c5d40002165225e5/files/68ef2ef10002790d1d32/view?project=68d2c288002f18043976&mode=admin",
      },
      {
        name: "Aloe Vera",
        scientific_name: "Aloe barbadensis miller",
        common_name: "- **Sabila**",
        informations:
          "**Aloe Vera** (*Aloe barbadensis miller*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
        how_to_use:
          "- **Topical:** Aloe Vera gel can be directly applied to the skin for burns, cuts, and irritation.\n- **Culinary:** Aloe Vera juice is consumed for its digestive benefits and to relieve constipation.\n- **Supplement:** Aloe Vera capsules or tablets are commonly used to support digestive health.",
        image_url:
          "https://fra.cloud.appwrite.io/v1/storage/buckets/68d2c5d40002165225e5/files/68ef2eec000411cf29da/view?project=68d2c288002f18043976&mode=admin",
      },
      {
        name: "Bottle Euphorbia",
        scientific_name: "Jatropha Podagrica",
        common_name: "- **Gout Plant**",
        informations:
          "**Bottle Euphorbia** (*Jatropha Podagrica*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
        how_to_use:
          "- **Topical:** Leaves can be crushed and applied directly to wounds for relief and healing.\n- **Oral:** The latex from the plant is sometimes used in folk medicine, but it should be used with caution as it can be toxic when ingested.",
        image_url:
          "https://fra.cloud.appwrite.io/v1/storage/buckets/68d2c5d40002165225e5/files/68ef2f2e001303896b13/view?project=68d2c288002f18043976&mode=admin",
      },
      {
        name: "Lemongrass",
        scientific_name: "Cymbopogon citratus",
        common_name: "- **Tanglad**",
        informations:
          "**Lemongrass** (*Cymbopogon citratus*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
        how_to_use:
          "- **Tea/Infusion:** Brew fresh or dried lemongrass leaves as a tea to soothe digestion and reduce stress.\n- **Topical:** Lemongrass oil can be used for skin infections, headaches, and as a natural insect repellent.\n- **Culinary:** Lemongrass is often used in Southeast Asian dishes, particularly in soups and curries.\n- **Supplement:** Lemongrass capsules or oils are available for digestive support and anti-inflammatory benefits.",
        image_url:
          "https://fra.cloud.appwrite.io/v1/storage/buckets/68d2c5d40002165225e5/files/68ef2f830023fbdb2899/view?project=68d2c288002f18043976&mode=admin",
      },
      {
        name: "False Oregano",
        scientific_name: "Plectranthus amboinicus",
        common_name: "- **Cuban Oregano**\n- **Oregano de Cuba**",
        informations:
          "**False Oregano** (*Plectranthus amboinicus*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
        how_to_use:
          "- **Tea/Infusion:** Leaves can be brewed into a tea for cough and colds relief.\n- **Topical:** Crushed leaves are applied to insect bites, burns, or skin irritations.\n- **Culinary:** Often used as a spice or flavoring in soups and meat dishes.",
        image_url:
          "https://fra.cloud.appwrite.io/v1/storage/buckets/68d2c5d40002165225e5/files/68ef2f4c002092e3d29c/view?project=68d2c288002f18043976&mode=admin",
      },
      {
        name: "Oregano",
        scientific_name: "Origanum vulgare",
        common_name: "- **Wild Marjoram**",
        informations:
          "**Oregano** (*Origanum vulgare*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
        how_to_use:
          "- **Tea/Infusion:** Oregano tea can help with colds, cough, and indigestion.\n- **Topical:** Oregano oil is applied for fungal infections or diluted for use on skin irritations.\n- **Culinary:** Widely used as a seasoning in Mediterranean cuisine.\n- **Aromatherapy:** The essential oil is used for respiratory issues and relaxation.",
        image_url:
          "https://fra.cloud.appwrite.io/v1/storage/buckets/68d2c5d40002165225e5/files/68ef2f99000b09ec54a0/view?project=68d2c288002f18043976&mode=admin",
      },
      {
        name: "Pandan",
        scientific_name: "Pandanus amaryllifolius",
        common_name: "- **Pandan**",
        informations:
          "**Pandan** (*Pandanus amaryllifolius*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
        how_to_use:
          "- **Tea/Infusion:** Pandan leaves can be boiled into tea for pain relief and relaxation.\n- **Topical:** Used in poultices for headaches or joint pain.\n- **Culinary:** Popular for flavoring rice and desserts in Filipino and Southeast Asian dishes.",
        image_url:
          "https://fra.cloud.appwrite.io/v1/storage/buckets/68d2c5d40002165225e5/files/68ef2fad0031af273a8c/view?project=68d2c288002f18043976&mode=admin",
      },
      {
        name: "Turmeric",
        scientific_name: "Curcuma longa",
        common_name: "- **Luyang Dilaw**",
        informations:
          "**Turmeric** (*Curcuma longa*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
        how_to_use:
          "- **Tea/Infusion:** Turmeric tea is consumed to support digestion and reduce inflammation.\n- **Topical:** A paste made from turmeric powder is applied to wounds and skin inflammations.\n- **Culinary:** Extensively used in curries, soups, and rice dishes for its color and medicinal value.\n- **Supplement:** Available in capsules or tinctures, often combined with black pepper for better absorption.",
        image_url:
          "https://fra.cloud.appwrite.io/v1/storage/buckets/68d2c5d40002165225e5/files/68ef2fb7001c92d1fbe3/view?project=68d2c288002f18043976&mode=admin",
      },
      {
        name: "Goethe Plant",
        scientific_name: "Kalanchoe pinnata",
        common_name: "- **Katakataka**",
        informations:
          "**Goethe Plant** (*Kalanchoe pinnata*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
        how_to_use:
          "- **Topical:** Fresh leaf juice is applied to wounds, burns, and skin infections.\n- **Oral:** In traditional medicine, the leaves are chewed or made into a juice for urinary problems and cough.",
        image_url:
          "https://fra.cloud.appwrite.io/v1/storage/buckets/68d2c5d40002165225e5/files/68ef2fc400369e7d8a64/view?project=68d2c288002f18043976&mode=admin",
      },
    ];

    const createdPlants = [];

    for (const plant of plants) {
      const created = await createMedicinalPlant(plant);
      createdPlants.push(created);
    }

    console.log(`✅ ${createdPlants.length} plants created!`);

    const locations = [
      { latitude: 10.739100, longitude: 124.793700, plant_id: createdPlants[0].$id },
      { latitude: 10.740000, longitude: 124.794300, plant_id: createdPlants[1].$id },
      { latitude: 10.738300, longitude: 124.793200, plant_id: createdPlants[2].$id },
      { latitude: 10.740300, longitude: 124.792800, plant_id: createdPlants[3].$id },
      { latitude: 10.738100, longitude: 124.794700, plant_id: createdPlants[4].$id },
      { latitude: 10.739600, longitude: 124.792500, plant_id: createdPlants[5].$id },
      { latitude: 10.737600, longitude: 124.794100, plant_id: createdPlants[6].$id },
      { latitude: 10.740700, longitude: 124.795000, plant_id: createdPlants[7].$id },
      { latitude: 10.738800, longitude: 124.792200, plant_id: createdPlants[8].$id },
      { latitude: 10.739900, longitude: 124.792900, plant_id: createdPlants[9].$id },
    ];

    for (const loc of locations) {
      await createPlantLocation(loc);
    }

    console.log(`✅ ${locations.length} plant locations created!`);
    console.log("🎉 All data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding plants and locations:", error);
  }
};
