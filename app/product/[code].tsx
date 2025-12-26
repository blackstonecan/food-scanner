import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ProductInfo } from '@/types/ProductInfo';
import ReviewsList from '@/components/ReviewsList';

export default function ProductDetailsPage() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (code) {
      fetchProductInfo(code);
    }
  }, [code]);

  const fetchProductInfo = async (barcode: string) => {
    setLoading(true);
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        Alert.alert('Error', 'Failed to fetch product information');
        router.back();
        return;
      }

      const data = await res.json();

      if (data.status !== 1) {
        Alert.alert(
          'Not Found',
          `Product with barcode ${barcode} not found in database.`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      const p = data.product;
      const n = p.nutriments || {};

      const formatTags = (tags: string[]) =>
        tags?.map((t) => t.replace(/^en:/, '')).join(', ') || 'None';

      const productData: ProductInfo = {
        code: p.code || barcode,
        name: p.product_name || 'N/A',
        genericName: p.generic_name || 'N/A',
        brands: p.brands || 'N/A',
        quantity: p.quantity || 'N/A',
        servingSize: p.serving_size || 'N/A',
        categories: p.categories || 'N/A',
        labels: p.labels || 'N/A',
        allergens: formatTags(p.allergens_tags || []),
        traces: formatTags(p.traces_tags || []),
        nutriScore: (p.nutriscore_grade || p.nutrition_grade_fr || 'N/A').toUpperCase(),
        novaGroup: p.nova_group != null ? p.nova_group.toString() : 'N/A',
        ecoscore: (p.ecoscore_grade || 'N/A').toUpperCase(),
        ingredients: p.ingredients_text || 'N/A',
        nutrition: {
          energy: n['energy-kcal_100g'] ? `${n['energy-kcal_100g']} kcal` : 'N/A',
          fat: n.fat_100g ? `${n.fat_100g} g` : 'N/A',
          saturatedFat: n['saturated-fat_100g']
            ? `${n['saturated-fat_100g']} g`
            : 'N/A',
          carbs: n.carbohydrates_100g ? `${n.carbohydrates_100g} g` : 'N/A',
          sugars: n.sugars_100g ? `${n.sugars_100g} g` : 'N/A',
          fiber: n.fiber_100g ? `${n.fiber_100g} g` : 'N/A',
          proteins: n.proteins_100g ? `${n.proteins_100g} g` : 'N/A',
          salt: n.salt_100g ? `${n.salt_100g} g` : 'N/A',
        },
        imageUrl: p.image_url || p.image_front_url || '',
      };

      setProductInfo(productData);
    } catch (err) {
      console.error('Error fetching product:', err);
      Alert.alert('Error', 'Could not fetch product information', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getNutriScoreColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      A: '#038141',
      B: '#85BB2F',
      C: '#FECB02',
      D: '#EE8100',
      E: '#E63E11',
    };
    return colors[grade] || '#666';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text style={styles.loadingText}>Loading product info...</Text>
        </View>
      </View>
    );
  }

  if (!productInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        {productInfo.imageUrl ? (
          <Image
            source={{ uri: productInfo.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.noImageText}>No Image Available</Text>
          </View>
        )}

        {/* Product Name & Brand */}
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{productInfo.name}</Text>
          {productInfo.brands !== 'N/A' && (
            <Text style={styles.productBrand}>{productInfo.brands}</Text>
          )}
          {productInfo.quantity !== 'N/A' && (
            <Text style={styles.productQuantity}>{productInfo.quantity}</Text>
          )}
          <Text style={styles.productCode}>Barcode: {productInfo.code}</Text>
        </View>

        {/* Scores Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health & Environment Scores</Text>
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
              <Text style={styles.scoreDescription}>Nutritional quality</Text>
            </View>

            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>NOVA Group</Text>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreValue}>{productInfo.novaGroup}</Text>
              </View>
              <Text style={styles.scoreDescription}>Processing level</Text>
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
              <Text style={styles.scoreDescription}>Environmental impact</Text>
            </View>
          </View>
        </View>

        {/* Nutrition Facts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Facts (per 100g)</Text>
          <View style={styles.nutritionTable}>
            <NutritionRow label="Energy" value={productInfo.nutrition.energy} />
            <NutritionRow label="Fat" value={productInfo.nutrition.fat} />
            <NutritionRow
              label="  Saturated Fat"
              value={productInfo.nutrition.saturatedFat}
              isIndented
            />
            <NutritionRow label="Carbohydrates" value={productInfo.nutrition.carbs} />
            <NutritionRow
              label="  Sugars"
              value={productInfo.nutrition.sugars}
              isIndented
            />
            <NutritionRow label="Fiber" value={productInfo.nutrition.fiber} />
            <NutritionRow label="Proteins" value={productInfo.nutrition.proteins} />
            <NutritionRow label="Salt" value={productInfo.nutrition.salt} />
          </View>
        </View>

        {/* Allergens */}
        {productInfo.allergens !== 'None' && (
          <View style={[styles.section, styles.alertSection]}>
            <Text style={styles.alertTitle}>⚠️ Allergens</Text>
            <Text style={styles.allergenText}>{productInfo.allergens}</Text>
          </View>
        )}

        {/* Traces */}
        {productInfo.traces !== 'None' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>May Contain Traces Of</Text>
            <Text style={styles.infoText}>{productInfo.traces}</Text>
          </View>
        )}

        {/* Ingredients */}
        {productInfo.ingredients !== 'N/A' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.ingredientsText}>{productInfo.ingredients}</Text>
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          {productInfo.genericName !== 'N/A' && (
            <InfoRow label="Generic Name" value={productInfo.genericName} />
          )}
          {productInfo.servingSize !== 'N/A' && (
            <InfoRow label="Serving Size" value={productInfo.servingSize} />
          )}
          {productInfo.categories !== 'N/A' && (
            <InfoRow label="Categories" value={productInfo.categories} />
          )}
          {productInfo.labels !== 'N/A' && (
            <InfoRow label="Labels" value={productInfo.labels} />
          )}
        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <ReviewsList
            barcode={productInfo.code}
            productName={productInfo.name}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const NutritionRow = ({
  label,
  value,
  isIndented = false,
}: {
  label: string;
  value: string;
  isIndented?: boolean;
}) => (
  <View style={styles.nutritionRow}>
    <Text style={[styles.nutritionLabel, isIndented && styles.indentedLabel]}>
      {label}
    </Text>
    <Text style={styles.nutritionValue}>{value}</Text>
  </View>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    color: '#00ff00',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 12,
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
  },

  // Product Image
  productImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 16,
  },
  noImagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  noImageText: {
    color: '#666',
    fontSize: 16,
  },

  // Product Header
  productHeader: {
    marginTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productCode: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },

  // Sections
  section: {
    marginTop: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },

  // Scores
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreBox: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  scoreBadge: {
    backgroundColor: '#333',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  scoreDescription: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    maxWidth: 80,
  },

  // Nutrition
  nutritionTable: {
    gap: 2,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  indentedLabel: {
    color: '#999',
    fontWeight: '400',
  },
  nutritionValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },

  // Alert Section
  alertSection: {
    backgroundColor: '#2a1a1a',
    borderColor: '#ff6b6b',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff6b6b',
    marginBottom: 12,
  },
  allergenText: {
    fontSize: 14,
    color: '#ff6b6b',
    lineHeight: 22,
    fontWeight: '500',
  },

  // Info
  infoText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  ingredientsText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  reviewsSection: {
    marginTop: 24,
    paddingBottom: 40,
  },
});
