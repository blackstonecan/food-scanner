import type { ScanHistoryItem } from '@/types/ProductInfo';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HistoryItemCardProps {
  item: ScanHistoryItem;
  onPress: (code: string) => void;
}

const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onPress }) => {
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

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const scanned = new Date(timestamp);
    const diffMs = now.getTime() - scanned.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return scanned.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.code)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.brands !== 'N/A' && (
          <Text style={styles.productBrand} numberOfLines={1}>
            {item.brands}
          </Text>
        )}
        <Text style={styles.timeText}>{getRelativeTime(item.scannedAt)}</Text>
      </View>

      {item.nutriScore && item.nutriScore !== 'N/A' && (
        <View
          style={[
            styles.nutriScoreBadge,
            { backgroundColor: getNutriScoreColor(item.nutriScore) },
          ]}
        >
          <Text style={styles.nutriScoreText}>{item.nutriScore}</Text>
        </View>
      )}

      <Text style={styles.arrowText}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  imageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: '#666',
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  productBrand: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#666',
  },
  nutriScoreBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  nutriScoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  arrowText: {
    fontSize: 28,
    color: '#666',
    fontWeight: '300',
  },
});

export default HistoryItemCard;
