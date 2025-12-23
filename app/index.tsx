import BarcodeScanning from '@react-native-ml-kit/barcode-scanning';
import { CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CameraModal from '@/components/CameraModal';
import ProductCard from '@/components/ProductCard';
import { ProductInfo } from '@/types/ProductInfo';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraVisible, setCameraVisible] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const openCamera = () => setCameraVisible(true);
  const closeCamera = () => setCameraVisible(false);

  const fetchProductInfo = async (barcode: string) => {
    setLoading(true);
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        Alert.alert('Error', 'Failed to fetch product information');
        return;
      }

      const data = await res.json();

      if (data.status !== 1) {
        Alert.alert(
          'Not Found',
          `Product with barcode ${barcode} not found in database.`
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
      Alert.alert('Error', 'Could not fetch product information');
    } finally {
      setLoading(false);
    }
  };

  const scanBarcodeFromImage = async (imageUri: string) => {
    try {
      let barcodes = await BarcodeScanning.scan(imageUri);
      barcodes = barcodes.filter(
        (barcode: any) => barcode.format === 32 || barcode.format === 64 // EAN-13 or EAN-8
      );

      if (barcodes && barcodes.length > 0) {
        const barcode = barcodes[0];
        const barcodeValue = barcode.value || 'NOT_FOUND';
        setScannedData(barcodeValue);

        if (barcodeValue !== 'NOT_FOUND') {
          await fetchProductInfo(barcodeValue);
        }
      } else {
        Alert.alert('No Barcode Found', 'No barcode detected in this image.');
      }
    } catch (e) {
      console.warn('Error scanning barcode from image:', e);
      Alert.alert('Scan Error', 'Could not scan barcode from image.');
    }
  };

  const handleCameraBarcode = async (barcode: string) => {
    setScannedData(barcode);
    setCameraVisible(false);
    await fetchProductInfo(barcode);
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPhotoUri(uri);
        await scanBarcodeFromImage(uri);
      }
    } catch (e) {
      console.warn('Error picking from gallery:', e);
    }
  };

  const clearAll = () => {
    setScannedData(null);
    setProductInfo(null);
    setPhotoUri(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Food Scanner</Text>

        <View style={styles.buttonsRow}>
          <Button title="Scan Barcode" onPress={openCamera} />
          <Button title="Select Image" onPress={pickFromGallery} />
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={styles.loadingText}>Loading product info...</Text>
          </View>
        )}

        {scannedData && !loading && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Scanned Barcode:</Text>
            <Text style={styles.resultText}>{scannedData}</Text>
          </View>
        )}

        {productInfo && !loading && (
          <ProductCard productInfo={productInfo} onClear={clearAll} />
        )}
      </ScrollView>

      <CameraModal
        visible={cameraVisible}
        facing={facing}
        onClose={closeCamera}
        onToggleFacing={toggleCameraFacing}
        onBarcodeScanned={handleCameraBarcode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: 'white',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#888',
    marginTop: 12,
    fontSize: 14,
  },
  resultContainer: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  resultLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
