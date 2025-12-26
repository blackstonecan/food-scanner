import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import StarRatingInput from './StarRatingInput';
import type { Review } from '@/types/Review';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, starCount: number) => Promise<void>;
  existingReview?: Review | null;
  productName?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  onSubmit,
  existingReview,
  productName,
}) => {
  const [starCount, setStarCount] = useState(5);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize with existing review data if editing
  useEffect(() => {
    if (existingReview) {
      setStarCount(existingReview.star_count);
      setContent(existingReview.content);
    } else {
      setStarCount(5);
      setContent('');
    }
    setError('');
  }, [existingReview, visible]);

  const handleSubmit = async () => {
    // Validation
    if (!content.trim()) {
      setError('Please write a review');
      return;
    }

    if (content.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    if (content.trim().length > 500) {
      setError('Review must be less than 500 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(content.trim(), starCount);
      onClose();
    } catch (err) {
      setError('Failed to save review. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {existingReview ? 'Edit Review' : 'Write Review'}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                disabled={loading}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {productName && (
              <Text style={styles.productName} numberOfLines={2}>
                {productName}
              </Text>
            )}

            <ScrollView
              style={styles.scrollView}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.label}>Rating</Text>
              <StarRatingInput
                value={starCount}
                onChange={setStarCount}
                size={48}
              />

              <Text style={styles.label}>Your Review</Text>
              <TextInput
                style={styles.textArea}
                value={content}
                onChangeText={setContent}
                placeholder="Share your thoughts about this product..."
                placeholderTextColor="#8A8A8A"
                multiline
                numberOfLines={6}
                maxLength={500}
                textAlignVertical="top"
                editable={!loading}
              />

              <Text style={styles.charCount}>{content.length}/500 characters</Text>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.cancelButton, loading && styles.buttonDisabled]}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {existingReview ? 'Update' : 'Submit'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 28,
    color: '#8A8A8A',
    fontWeight: '300',
  },
  productName: {
    fontSize: 14,
    color: '#8A8A8A',
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: 12,
    marginTop: 8,
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    color: '#2D2D2D',
    fontSize: 15,
    minHeight: 120,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#8A8A8A',
    textAlign: 'right',
    marginBottom: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 13,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#5A5A5A',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FF6347',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default ReviewModal;
