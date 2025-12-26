import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import ReviewCard from '@/components/ReviewCard';
import ReviewModal from '@/components/ReviewModal';
import {
  getAllUserReviews,
  updateReview,
  deleteReview,
} from '@/utilities/reviewService';
import type { Review } from '@/types/Review';

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [])
  );

  const loadReviews = async () => {
    setLoading(true);
    try {
      const userReviews = await getAllUserReviews();
      setReviews(userReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setModalVisible(true);
  };

  const handleDelete = async (reviewId: string) => {
    const success = await deleteReview(reviewId);
    if (success) {
      await loadReviews();
    } else {
      Alert.alert('Error', 'Failed to delete review');
    }
  };

  const handleSubmitEdit = async (content: string, starCount: number) => {
    if (editingReview) {
      const updated = await updateReview(editingReview.id, {
        content,
        star_count: starCount,
      });
      if (updated) {
        setModalVisible(false);
        setEditingReview(null);
        await loadReviews();
      } else {
        Alert.alert('Error', 'Failed to update review');
      }
    }
  };

  const handleProductPress = (barcode: string) => {
    router.push(`/product/${barcode}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reviews</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6347" />
            <Text style={styles.loadingText}>Loading reviews...</Text>
          </View>
        ) : reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Reviews Yet</Text>
            <Text style={styles.emptyStateText}>
              Start scanning products and share your thoughts!
            </Text>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.scanButtonText}>Scan a Product</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.countText}>
              You have written {reviews.length}{' '}
              {reviews.length === 1 ? 'review' : 'reviews'}
            </Text>

            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <TouchableOpacity
                  onPress={() => handleProductPress(review.barcode)}
                  style={styles.barcodeContainer}
                >
                  <Text style={styles.barcodeText}>
                    Product: {review.barcode}
                  </Text>
                  <Text style={styles.viewProductText}>View Product →</Text>
                </TouchableOpacity>

                <ReviewCard
                  review={review}
                  isUserReview
                  onEdit={() => handleEdit(review)}
                  onDelete={() => handleDelete(review.id)}
                />
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <ReviewModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingReview(null);
        }}
        onSubmit={handleSubmitEdit}
        existingReview={editingReview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    color: '#FF6347',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D2D',
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#8A8A8A',
    marginTop: 12,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#8A8A8A',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  scanButton: {
    backgroundColor: '#FF6347',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  countText: {
    fontSize: 14,
    color: '#8A8A8A',
    marginBottom: 20,
  },
  reviewItem: {
    marginBottom: 24,
  },
  barcodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  barcodeText: {
    color: '#5A5A5A',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  viewProductText: {
    color: '#FF6347',
    fontSize: 13,
    fontWeight: '600',
  },
});
