export interface ProductInfo {
  code: string;
  name: string;
  genericName: string;
  brands: string;
  quantity: string;
  servingSize: string;
  categories: string;
  labels: string;
  allergens: string;
  traces: string;
  nutriScore: string;
  novaGroup: string;
  ecoscore: string;
  ingredients: string;
  foodGroups: string;
  nutrition: {
    energy: string;
    fat: string;
    saturatedFat: string;
    carbs: string;
    sugars: string;
    fiber: string;
    proteins: string;
    salt: string;
  };
  nutrientLevels: {
    fat: string;
    saturatedFat: string;
    sugars: string;
    salt: string;
  };
  imageUrl: string;
  imageFrontUrl: string;
  imageNutritionUrl: string;
}

export interface ScanHistoryItem {
  code: string;
  name: string;
  brands: string;
  imageUrl: string;
  nutriScore: string;
  scannedAt: string; // ISO 8601 timestamp
}
