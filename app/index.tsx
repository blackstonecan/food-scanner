import BarcodeScanning from '@react-native-ml-kit/barcode-scanning';
import { CameraType, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CameraModal from '@/components/CameraModal';
import HistoryItemCard from '@/components/HistoryItemCard';
import type { ScanHistoryItem } from '@/types/ProductInfo';
import { addScanToHistory, getRecentScans } from '@/utilities/historyService';

export default function App() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraVisible, setCameraVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);

  // Load recent scans when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRecentScans();
    }, [])
  );

  const loadRecentScans = () => {
    const scans = getRecentScans(5);
    setRecentScans(scans);
  };

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

  const verifyAndNavigate = async (barcode: string) => {
    setLoading(true);
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        Alert.alert('Error', 'Failed to fetch product information');
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.status !== 1) {
        Alert.alert(
          'Not Found',
          `Product with barcode ${barcode} not found in database.`
        );
        setLoading(false);
        return;
      }

      // Save to history
      try {
        addScanToHistory({
          code: barcode,
          name: data.product.product_name || 'Unknown',
          brands: data.product.brands || 'N/A',
          imageUrl: data.product.image_url || '',
          nutriScore: data.product.nutriscore_grade?.toUpperCase() || 'N/A',
          scannedAt: new Date().toISOString(),
        });
        loadRecentScans(); // Refresh the history display
      } catch (err) {
        console.warn('Failed to save scan history:', err);
      }

      // Product exists, navigate to details page
      setLoading(false);
      router.push(`/product/${barcode}`);
    } catch (err) {
      console.error('Error fetching product:', err);
      Alert.alert('Error', 'Could not fetch product information');
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

        if (barcodeValue !== 'NOT_FOUND') {
          await verifyAndNavigate(barcodeValue);
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
    setCameraVisible(false);
    await verifyAndNavigate(barcode);
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        await scanBarcodeFromImage(uri);
      }
    } catch (e) {
      console.warn('Error picking from gallery:', e);
    }
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
            <Text style={styles.loadingText}>Verifying product...</Text>
          </View>
        )}

        {recentScans.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
              <Text style={styles.historySectionTitle}>Recent Scans</Text>
              <TouchableOpacity onPress={() => router.push('/history')}>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>

            {recentScans.map((item) => (
              <HistoryItemCard
                key={item.code + item.scannedAt}
                item={item}
                onPress={(code) => router.push(`/product/${code}`)}
              />
            ))}
          </View>
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
  historySection: {
    marginTop: 32,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historySectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  viewAllText: {
    fontSize: 14,
    color: '#00ff00',
    fontWeight: '500',
  },
});
