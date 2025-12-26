import { MaterialIcons } from '@expo/vector-icons';
import BarcodeScanning from '@react-native-ml-kit/barcode-scanning';
import { CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [validationError, setValidationError] = useState('');

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

  const openCamera = () => {
    setShowManualEntry(false);
    setBarcodeInput('');
    setValidationError('');
    setCameraVisible(true);
  };
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
    setShowManualEntry(false);
    setBarcodeInput('');
    setValidationError('');

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

  const openManualEntry = () => {
    setShowManualEntry(true);
    setBarcodeInput('');
    setValidationError('');
  };

  const closeManualEntry = () => {
    setShowManualEntry(false);
    setBarcodeInput('');
    setValidationError('');
  };

  const handleBarcodeInputChange = (text: string) => {
    // Only allow numeric input and limit to 13 characters
    if (text && !/^\d+$/.test(text)) {
      setValidationError('Only numbers are allowed');
      return;
    }

    if (text.length > 13) {
      return; // Don't allow input beyond 13 characters
    }

    setBarcodeInput(text);
    setValidationError('');
  };

  const submitManualBarcode = async () => {
    const trimmed = barcodeInput.trim();

    // Validation
    if (!trimmed) {
      setValidationError('Please enter a barcode');
      return;
    }

    if (!/^\d+$/.test(trimmed)) {
      setValidationError('Barcode must contain only numbers');
      return;
    }

    if (trimmed.length !== 8 && trimmed.length !== 13) {
      setValidationError('Barcode must be 8 or 13 digits (EAN-8 or EAN-13)');
      return;
    }

    // Clear and close before verifying
    closeManualEntry();

    // Use existing verification function
    await verifyAndNavigate(trimmed);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>Food Scanner</Text>
          <Text style={styles.subtitle}>
            Scan any product to discover nutrition facts and reviews
          </Text>
        </View>

        {/* Main Action Cards */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={openCamera}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="qr-code-scanner" size={48} color="#FF6347" />
            </View>
            <Text style={styles.actionCardTitle}>Scan Barcode</Text>
            <Text style={styles.actionCardDescription}>
              Use camera to scan product
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={pickFromGallery}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="photo-library" size={48} color="#FF6347" />
            </View>
            <Text style={styles.actionCardTitle}>Select Image</Text>
            <Text style={styles.actionCardDescription}>
              Choose from gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              showManualEntry && styles.actionCardActive,
              loading && styles.actionCardDisabled,
            ]}
            onPress={showManualEntry ? closeManualEntry : openManualEntry}
            disabled={loading}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons
                name={showManualEntry ? 'close' : 'keyboard'}
                size={48}
                color="#FF6347"
              />
            </View>
            <Text style={styles.actionCardTitle}>
              {showManualEntry ? 'Cancel' : 'Enter Code'}
            </Text>
            <Text style={styles.actionCardDescription}>
              {showManualEntry ? 'Close manual entry' : 'Type barcode manually'}
            </Text>
          </TouchableOpacity>
        </View>

        {showManualEntry && (
          <View style={styles.manualEntryCard}>
            <Text style={styles.manualEntryLabel}>Enter Barcode Number</Text>

            <TextInput
              style={[
                styles.barcodeInput,
                validationError && styles.barcodeInputError,
              ]}
              value={barcodeInput}
              onChangeText={handleBarcodeInputChange}
              placeholder="Enter 8 or 13 digit barcode"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={13}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              accessibilityLabel="Barcode number input"
              onSubmitEditing={submitManualBarcode}
              returnKeyType="done"
            />

            {validationError ? (
              <Text style={styles.errorText}>{validationError}</Text>
            ) : (
              <Text style={styles.hintText}>EAN-8 or EAN-13 format</Text>
            )}

            <View style={styles.manualEntryButtons}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={submitManualBarcode}
                disabled={loading}
                accessibilityLabel="Submit barcode"
              >
                <MaterialIcons name="check" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeManualEntry}
                disabled={loading}
                accessibilityLabel="Cancel manual entry"
              >
                <MaterialIcons name="close" size={20} color="#5A5A5A" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6347" />
            <Text style={styles.loadingText}>Verifying product...</Text>
          </View>
        )}

        {recentScans.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
              <Text style={styles.historySectionTitle}>Recent Scans</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push('/history')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <MaterialIcons name="arrow-forward" size={18} color="#FF6347" />
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

        <View style={styles.myReviewsSection}>
          <TouchableOpacity
            style={styles.myReviewsButton}
            onPress={() => router.push('/reviews')}
          >
            <MaterialIcons name="rate-review" size={24} color="#FF6347" />
            <Text style={styles.myReviewsButtonText}>My Reviews</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
  },
  heroSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#8A8A8A',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#5A5A5A',
  },
  actionsGrid: {
    marginBottom: 32,
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionCardActive: {
    borderColor: '#FF6347',
    borderWidth: 2,
    backgroundColor: '#FFF8F6',
  },
  actionCardDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE5E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 6,
  },
  actionCardDescription: {
    fontSize: 13,
    color: '#8A8A8A',
    textAlign: 'center',
  },
  manualEntryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  manualEntryLabel: {
    color: '#2D2D2D',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  barcodeInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: '#2D2D2D',
    fontSize: 18,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  barcodeInputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  hintText: {
    color: '#8A8A8A',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  manualEntryButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FF6347',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0B0B0',
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelButtonText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#8A8A8A',
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
    color: '#2D2D2D',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6347',
    fontWeight: '600',
  },
  myReviewsSection: {
    marginTop: 24,
  },
  myReviewsButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF6347',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  myReviewsButtonText: {
    color: '#FF6347',
    fontSize: 16,
    fontWeight: '600',
  },
});
