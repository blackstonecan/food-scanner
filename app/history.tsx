import HistoryItemCard from '@/components/HistoryItemCard';
import type { ScanHistoryItem } from '@/types/ProductInfo';
import { clearAllHistory, getAllScans } from '@/utilities/historyService';
import { useFocusEffect, useRouter } from 'expo-router';
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

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load history when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = () => {
    setLoading(true);
    const allScans = getAllScans();
    setHistory(allScans);
    setLoading(false);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all scan history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scan History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No scans yet. Start by scanning a product!
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.historyList}>
              {history.map((item) => (
                <HistoryItemCard
                  key={item.code + item.scannedAt}
                  item={item}
                  onPress={(code) => router.push(`/product/${code}`)}
                />
              ))}
            </View>

            <View style={styles.clearButtonContainer}>
              <Button
                title="Clear All History"
                onPress={handleClearAll}
                color="#ff4444"
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#000',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#00ff00',
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  historyList: {
    marginBottom: 24,
  },
  clearButtonContainer: {
    marginTop: 16,
  },
});
