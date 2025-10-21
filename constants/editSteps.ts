export const editSteps = [
  {
    key: "name",
    title: "Name & Scientic Name",
    instructions: [
      "Enter the name of the plant.",
      "Enter the scientific name of the plant.",
    ],
    placeholder: "",
  },
  {
    key: "visuals",
    title: "Picture & Common Name",
    instructions: [
      "Tap the image area to upload or change the picture of the plant.",
      "Enter the common name of the plant in the input field.",
      "Start each line with '-' to create a bullet point.",
      "Use **double asterisks** to make text bold.",

    ],
    placeholder: "Enter the common name... \n e.g.,\n- **Rose**\n- **Aloe Vera**\n- **Sunflower**",
  },
  {
    key: "info",
    title: "Plant Information",
    instructions: [
      "Wrap text with *single asterisk* to make it *italic*.",
      "Wrap text with **double asterisks** to make it **bold**.",
      "Wrap text with ***triple asterisks*** to make it ***bold and italic***.",
    ],
    placeholder: "Enter information about this plant...\n e.g.,\n**Basil** (*Ocimum basilicum*) is a medicinal plant traditionally used in herb..."
  },
  {
    key: "usage",
    title: "How to Use the Medicinal Plant",
    instructions: [
      'Start each line with "- " to create a bullet point.',
      "Use **double asterisks** to make text bold within a bullet.",
    ],
    placeholder: "Describe how this plant is used medicinally...\n\ e.g.,:\n- **Basil** leaves can be bre...\n- **Ginger** root is used t..."
  },
  {
    key: "location",
    title: "Medicinal Plant Location",
    instructions: [
      "Tap the map to add a marker.",
      "Tap an existing marker to remove it.",
      "Hold and drag a marker to change its location.",
    ],
    placeholder: "",
  },
];

export const data = {
    editSteps,
};
