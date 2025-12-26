import type { ProductInfo } from "@/types/ProductInfo";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  productInfo: ProductInfo;
  onClear: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ productInfo, onClear }) => {
  const router = useRouter();

  const getNutriScoreColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      A: "#52C197",
      B: "#9FD356",
      C: "#FFD166",
      D: "#FF9F66",
      E: "#FF6B6B",
    };
    return colors[grade] || "#B0B0B0";
  };

  const handleViewDetails = () => {
    router.push(`/product/${productInfo.code}`);
  };

  return (
    <View style={styles.productCard}>
      {/* Product Header */}
      <View style={styles.productHeader}>
        {productInfo.imageUrl ? (
          <Image
            source={{ uri: productInfo.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : null}
        <View style={styles.productHeaderText}>
          <Text style={styles.productName}>{productInfo.name}</Text>
          {productInfo.brands !== "N/A" && (
            <Text style={styles.productBrand}>{productInfo.brands}</Text>
          )}
          {productInfo.quantity !== "N/A" && (
            <Text style={styles.productQuantity}>{productInfo.quantity}</Text>
          )}
        </View>
      </View>

      {/* Scores */}
      <View style={styles.scoresContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Nutri-Score</Text>
          <View
            style={[
              styles.scoreBadge,
              { backgroundColor: getNutriScoreColor(productInfo.nutriScore) },
            ]}
          >
            <Text style={styles.scoreValue}>{productInfo.nutriScore}</Text>
          </View>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>NOVA Group</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreValue}>{productInfo.novaGroup}</Text>
          </View>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Eco-Score</Text>
          <View
            style={[
              styles.scoreBadge,
              { backgroundColor: getNutriScoreColor(productInfo.ecoscore) },
            ]}
          >
            <Text style={styles.scoreValue}>{productInfo.ecoscore}</Text>
          </View>
        </View>
      </View>

      {/* Nutrition */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition (per 100g)</Text>
        <View style={styles.nutritionGrid}>
          <NutritionItem label="Energy" value={productInfo.nutrition.energy} />
          <NutritionItem label="Fat" value={productInfo.nutrition.fat} />
          <NutritionItem
            label="Saturated Fat"
            value={productInfo.nutrition.saturatedFat}
            indent
          />
          <NutritionItem label="Carbs" value={productInfo.nutrition.carbs} />
          <NutritionItem
            label="Sugars"
            value={productInfo.nutrition.sugars}
            indent
          />
          <NutritionItem label="Fiber" value={productInfo.nutrition.fiber} />
          <NutritionItem
            label="Proteins"
            value={productInfo.nutrition.proteins}
          />
          <NutritionItem label="Salt" value={productInfo.nutrition.salt} />
        </View>
      </View>

      {/* Allergens */}
      {productInfo.allergens !== "None" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Allergens</Text>
          <Text style={styles.allergenText}>{productInfo.allergens}</Text>
        </View>
      )}

      {productInfo.traces !== "None" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traces</Text>
          <Text style={styles.infoText}>{productInfo.traces}</Text>
        </View>
      )}

      {/* Ingredients */}
      {productInfo.ingredients !== "N/A" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.ingredientsText}>{productInfo.ingredients}</Text>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}>
          <Text style={styles.detailsButtonText}>View Full Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NutritionItem = ({
  label,
  value,
  indent = false,
}: {
  label: string;
  value: string;
  indent?: boolean;
}) => (
  <View style={styles.nutritionRow}>
    <Text style={[styles.nutritionLabel, indent && styles.indentLabel]}>
      {label}
    </Text>
    <Text style={styles.nutritionValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productHeader: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  productHeaderText: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: "#5A5A5A",
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
    color: "#8A8A8A",
  },

  scoresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  scoreBox: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 10,
    color: "#8A8A8A",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  scoreBadge: {
    backgroundColor: "#F5F5F5",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D2D2D",
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 12,
  },

  nutritionGrid: {
    gap: 8,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  nutritionLabel: {
    fontSize: 14,
    color: "#5A5A5A",
  },
  indentLabel: {
    paddingLeft: 16,
    color: "#8A8A8A",
  },
  nutritionValue: {
    fontSize: 14,
    color: "#2D2D2D",
    fontWeight: "500",
  },

  allergenText: {
    fontSize: 14,
    color: "#FF6B6B",
    lineHeight: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#5A5A5A",
    lineHeight: 20,
  },
  ingredientsText: {
    fontSize: 13,
    color: "#8A8A8A",
    lineHeight: 20,
  },

  buttonsContainer: {
    gap: 12,
    marginTop: 8,
  },
  detailsButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FF6347",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "#F44336",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductCard;
