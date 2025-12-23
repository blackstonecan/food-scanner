import type { ProductInfo } from "@/types/ProductInfo";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  productInfo: ProductInfo;
  onClear: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ productInfo, onClear }) => {
  const getNutriScoreColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      A: "#038141",
      B: "#85BB2F",
      C: "#FECB02",
      D: "#EE8100",
      E: "#E63E11",
    };
    return colors[grade] || "#666";
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

      <TouchableOpacity style={styles.clearButton} onPress={onClear}>
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
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
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
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
    backgroundColor: "#fff",
  },
  productHeaderText: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: "#888",
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
    color: "#666",
  },

  scoresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  scoreBox: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 10,
    color: "#888",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  scoreBadge: {
    backgroundColor: "#333",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
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
    color: "#ccc",
  },
  indentLabel: {
    paddingLeft: 16,
    color: "#999",
  },
  nutritionValue: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },

  allergenText: {
    fontSize: 14,
    color: "#ff6b6b",
    lineHeight: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  ingredientsText: {
    fontSize: 13,
    color: "#aaa",
    lineHeight: 20,
  },

  clearButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductCard;
