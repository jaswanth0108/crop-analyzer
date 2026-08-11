export interface DatasetInfo {
  id: string;
  name: string;
  sourceLink: string;
  crops: string[];
  diseasesCovered: number;
  purpose: string;
  modelArchitecture: string;
  license: string;
  limitations: string[];
}

export const DATASETS: DatasetInfo[] = [
  {
    id: "paddy-doctor",
    name: "Paddy Doctor",
    sourceLink: "https://paddydoc.github.io/dataset/",
    crops: ["Rice"],
    diseasesCovered: 4,
    purpose: "Primary rice/paddy disease classification and India-focused field image validation.",
    modelArchitecture: "EfficientNet-B0 / MobileNetV3",
    license: "Open (Academic/Research)",
    limitations: [
      "Healthy, disease, and pest labels must be kept strictly separate during training.",
      "Requires label normalization before merging with other datasets.",
    ],
  },
  {
    id: "plantvillage",
    name: "PlantVillage",
    sourceLink: "https://github.com/spMohanty/PlantVillage-Dataset",
    crops: ["Tomato", "Potato"],
    diseasesCovered: 6,
    purpose: "Initial tomato and potato classification baseline.",
    modelArchitecture: "EfficientNet-B0",
    license: "CC0 (Public Domain)",
    limitations: [
      "Laboratory conditions (solid backgrounds) may not generalize perfectly to field conditions.",
      "Used only specific filtered classes per project spec.",
    ],
  },
  {
    id: "plantdoc",
    name: "PlantDoc",
    sourceLink: "https://github.com/pratikkayal/PlantDoc-Dataset",
    crops: ["Multiple"],
    diseasesCovered: 13, // Overall, though we use specific ones
    purpose: "Real-world validation, natural background testing, and external validation to measure generalization.",
    modelArchitecture: "EfficientNet-B0",
    license: "MIT",
    limitations: [
      "Used primarily as an external validation set rather than primary training.",
      "High variance in image quality.",
    ],
  },
  {
    id: "icar",
    name: "ICAR Rice and Maize Dataset",
    sourceLink: "https://aikosh.indiaai.gov.in/home/datasets/details/crop_disease_and_insect_pest_image_dataset_for_rice_and_maize.html",
    crops: ["Rice"],
    diseasesCovered: 4,
    purpose: "External validation for India-specific real agricultural conditions.",
    modelArchitecture: "Validation Only",
    license: "ICAR Data Use License",
    limitations: [
      "Requires verified access permission.",
      "Not used automatically for training without manual review.",
    ],
  },
  {
    id: "rice-seg",
    name: "Rice Disease Segmentation Dataset",
    sourceLink: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9695445/",
    crops: ["Rice"],
    diseasesCovered: 3,
    purpose: "Lesion segmentation and rice severity estimation based on affected pixel area.",
    modelArchitecture: "U-Net / DeepLabV3+",
    license: "Academic/Research",
    limitations: [
      "Labels exist only for specific rice diseases (Blight, Blast, Brown Spot).",
      "Severity estimation cannot be generalized to unsupported crops.",
    ],
  },
];
