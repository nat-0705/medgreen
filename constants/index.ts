import images from "./images";

export const plantProcess = [
    {
      id: 1,
      title: "Identify Medicinal Plants Instantly!",
      description:
        "Take a photo of a plant, and our AI will identify it within seconds.",
      image: images.takeAPhoto,
    },
    {
      id: 2,
      title: "Find Medicinal Plants Near You",
      description:
        "Use the interactive map to discover and learn about medicinal plants in your area.",
      image: images.plantLocation, 
    },
    {
      id: 3,
      title: "Learn & Explore Plant Benefits",
      description:
        "Discover traditional and scientific uses of medicinal plants for better health.",
      image: images.plantDetails,
    },
];
  

export const data = {
    plantProcess,
};