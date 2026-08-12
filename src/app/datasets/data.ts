// ============================================================
// AgriShield — Dataset Registry (All 4 sources)
// ============================================================

export interface DatasetInfo {
  id: string;
  name: string;
  shortName: string;
  url: string;
  description: string;
  numImages: number;
  numSpecies: number;
  numClasses: number;
  license: string;
  year: number;
  citation: string;
  limitations: string[];
  coverage: string[];
}

export const DATASETS: DatasetInfo[] = [
  {
    id: "plantvillage",
    name: "PlantVillage Dataset",
    shortName: "PlantVillage",
    url: "https://github.com/spMohanty/PlantVillage-Dataset",
    description:
      "One of the largest publicly available agricultural image datasets, with 54,306 controlled-environment images of healthy and diseased plant leaves across 14 crop species and 26 disease conditions. The foundation of this model.",
    numImages: 54306,
    numSpecies: 14,
    numClasses: 38,
    license: "CC BY 4.0",
    year: 2016,
    citation:
      'Mohanty, S.P., Hughes, D.P., Salathé, M. (2016). "Using Deep Learning for Image-Based Plant Disease Detection." Frontiers in Plant Science.',
    limitations: [
      "Lab/controlled environment images — may not generalise to field conditions",
      "No background clutter or occlusion",
      "Images taken under uniform lighting",
    ],
    coverage: [
      "Apple (4 classes)", "Blueberry (1)", "Cherry (2)", "Corn/Maize (4)",
      "Grape (4)", "Orange (1)", "Peach (2)", "Bell Pepper (2)",
      "Potato (3)", "Raspberry (1)", "Soybean (1)", "Squash (1)",
      "Strawberry (2)", "Tomato (10)",
    ],
  },
  {
    id: "new_plant_diseases",
    name: "New Plant Diseases Dataset",
    shortName: "NPD (Kaggle)",
    url: "https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset",
    description:
      "An augmented version of PlantVillage with 87,000+ images across 38 classes, expanded with flipping, Gaussian noise, rotation, and zoom augmentation for better model generalisation.",
    numImages: 87867,
    numSpecies: 14,
    numClasses: 38,
    license: "CC BY 4.0",
    year: 2020,
    citation:
      "Vipoooool. (2020). New Plant Diseases Dataset. Kaggle. https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset",
    limitations: [
      "Derived from PlantVillage — inherits lab-environment limitations",
      "Augmentation may introduce synthetic artefacts",
    ],
    coverage: [
      "Same 14 species as PlantVillage",
      "Pre-split train/val set included",
      "Expanded via image augmentation",
    ],
  },
  {
    id: "plantdoc",
    name: "PlantDoc Dataset",
    shortName: "PlantDoc",
    url: "https://github.com/pratikkayal/PlantDoc-Dataset",
    description:
      "2,569 field-realistic images scraped from the web across 13 plant species and 17 disease conditions. Unlike PlantVillage, these images include real-world backgrounds, partial occlusion, and varying lighting — making the model more robust to real field photographs.",
    numImages: 2569,
    numSpecies: 13,
    numClasses: 17,
    license: "CC BY 4.0",
    year: 2019,
    citation:
      'Singh, D., Jain, N., Jain, P., et al. (2020). "PlantDoc: A Dataset for Visual Plant Disease Detection." CoDS-COMAD 2020.',
    limitations: [
      "Smaller dataset — less representation per class",
      "Web-scraped images may contain noise or mislabels",
    ],
    coverage: [
      "Apple, Blueberry, Cherry, Corn, Grape, Peach, Pepper, Potato",
      "Raspberry, Soybean, Squash, Strawberry, Tomato",
      "Real field conditions with background clutter",
    ],
  },
  {
    id: "paddy_doctor",
    name: "Paddy Doctor Dataset",
    shortName: "Paddy Doctor",
    url: "https://paddydoc.github.io/dataset/",
    description:
      "16,225 annotated images of rice/paddy leaves covering 12 disease and pest conditions plus healthy leaves. The most comprehensive publicly available paddy disease dataset, covering bacterial, fungal, and pest categories unique to rice cultivation.",
    numImages: 16225,
    numSpecies: 1,
    numClasses: 13,
    license: "CC BY 4.0",
    year: 2022,
    citation:
      'Petchiammal, A., et al. (2022). "Paddy Doctor: A Visual Image Dataset for Automated Paddy Disease Classification and Benchmarking." ACM MM 2022.',
    limitations: [
      "Rice/paddy only — does not cover other crops",
      "Regional focus (South/South-East Asian varieties)",
    ],
    coverage: [
      "Bacterial Leaf Blight, Bacterial Leaf Streak, Bacterial Panicle Blight",
      "Blast, Brown Spot, Downy Mildew, Hispa, Leaf Roller",
      "Tungro, Black/White/Yellow Stem Borer, Healthy",
    ],
  },
];

export const DATASET_TOTALS = {
  totalImages: DATASETS.reduce((a, d) => a + d.numImages, 0),
  totalSpecies: 15, // unique after merging
  totalClasses: 48, // unique after label normalization
};
