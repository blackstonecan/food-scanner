import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';
import ReviewModal from './ReviewModal';
import {
  getReviewsByBarcode,
  getUserReviewForProduct,
  createReview,
  updateReview,
  deleteReview,
  getAverageRating,
} from '@/utilities/reviewService';
import type { Review } from '@/types/Review';

interface ReviewsListProps {
  barcode: string;
  productName?: string;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ barcode, productName }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [barcode]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const [allReviews, userRev, avgRating] = await Promise.all([
        getReviewsByBarcode(barcode),
        getUserReviewForProduct(barcode),
        getAverageRating(barcode),
      ]);

      setReviews(allReviews);
      setUserReview(userRev);
      setAverageRating(avgRating.average);
      setReviewCount(avgRating.count);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (content: string, starCount: number) => {
    if (userReview) {
      // Update existing review
      const updated = await updateReview(userReview.id, {
        content,
        star_count: starCount,
      });
      if (updated) {
        await loadReviews();
      }
    } else {
      // Create new review
      const created = await createReview({ barcode, content, star_count: starCount });
      if (created) {
        await loadReviews();
      }
    }
  };

  const handleDeleteReview = async () => {
    if (userReview) {
      const deleted = await deleteReview(userReview.id);
      if (deleted) {
        setUserReview(null);
        await loadReviews();
      }
    }
  };

  const otherReviews = reviews.filter((r) => r.id !== userReview?.id);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {reviewCount > 0 && (
          <View style={styles.averageContainer}>
            <StarRating rating={averageRating} size={18} showNumber />
            <Text style={styles.reviewCount}>({reviewCount})</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.writeReviewButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.writeReviewButtonText}>
          {userReview ? '✏️ Edit Your Review' : '✍️ Write a Review'}
        </Text>
      </TouchableOpacity>

      {userReview && (
        <>
          <Text style={styles.subsectionTitle}>Your Review</Text>
          <ReviewCard
            review={userReview}
            isUserReview
            onEdit={() => setModalVisible(true)}
            onDelete={handleDeleteReview}
          />
        </>
      )}

      {otherReviews.length > 0 ? (
        <>
          <Text style={styles.subsectionTitle}>
            {userReview ? 'Other Reviews' : 'All Reviews'}
          </Text>
          {otherReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </>
      ) : (
        !userReview && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No reviews yet. Be the first to review!
            </Text>
          </View>
        )
      )}

      <ReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitReview}
        existingReview={userReview}
        productName={productName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
  },
  averageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    fontSize: 14,
    color: '#8A8A8A',
    marginLeft: 8,
  },
  writeReviewButton: {
    backgroundColor: '#FF6347',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  writeReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A5A5A',
    marginBottom: 12,
    marginTop: 8,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#8A8A8A',
    textAlign: 'center',
  },
});

export default ReviewsList;
