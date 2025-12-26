import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Review } from '@/types/Review';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
  isUserReview?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isUserReview = false,
  onEdit,
  onDelete,
}) => {
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const reviewDate = new Date(timestamp);
    const diffMs = now.getTime() - reviewDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return reviewDate.toLocaleDateString();
  };

  const handleDelete = () => {
    Alert.alert('Delete Review', 'Are you sure you want to delete this review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };

  return (
    <View
      style={[styles.container, isUserReview && styles.userReviewContainer]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <StarRating rating={review.star_count} size={16} />
          <Text style={styles.timeText}>{getRelativeTime(review.created_at)}</Text>
        </View>
        {isUserReview && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.content}>{review.content}</Text>

      {isUserReview && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Your Review</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  userReviewContainer: {
    borderColor: '#FF6347',
    backgroundColor: '#FFE5E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#8A8A8A',
    marginLeft: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editText: {
    color: '#FF6347',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteText: {
    color: '#F44336',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    color: '#5A5A5A',
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FF6347',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default ReviewCard;
