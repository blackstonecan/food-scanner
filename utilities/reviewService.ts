import { supabase } from './supabaseClient';
import { getDeviceId } from './deviceService';
import type {
  Review,
  CreateReviewInput,
  UpdateReviewInput,
} from '@/types/Review';

/**
 * Get all reviews for a specific product by barcode
 */
export const getReviewsByBarcode = async (
  barcode: string
): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('barcode', barcode)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getReviewsByBarcode:', error);
    return [];
  }
};

/**
 * Get user's review for a specific product (if it exists)
 */
export const getUserReviewForProduct = async (
  barcode: string
): Promise<Review | null> => {
  try {
    const deviceId = await getDeviceId();

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('barcode', barcode)
      .eq('device_id', deviceId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No review found (expected for new users)
        return null;
      }
      console.error('Error fetching user review:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserReviewForProduct:', error);
    return null;
  }
};

/**
 * Get all reviews created by this device
 */
export const getAllUserReviews = async (): Promise<Review[]> => {
  try {
    const deviceId = await getDeviceId();

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllUserReviews:', error);
    return [];
  }
};

/**
 * Create a new review
 */
export const createReview = async (
  input: CreateReviewInput
): Promise<Review | null> => {
  try {
    const deviceId = await getDeviceId();

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        device_id: deviceId,
        barcode: input.barcode,
        content: input.content,
        star_count: input.star_count,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createReview:', error);
    return null;
  }
};

/**
 * Update an existing review
 */
export const updateReview = async (
  reviewId: string,
  input: UpdateReviewInput
): Promise<Review | null> => {
  try {
    const deviceId = await getDeviceId();

    // Ensure the review belongs to this device
    const { data, error } = await supabase
      .from('reviews')
      .update({
        content: input.content,
        star_count: input.star_count,
      })
      .eq('id', reviewId)
      .eq('device_id', deviceId) // Security check
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateReview:', error);
    return null;
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: string): Promise<boolean> => {
  try {
    const deviceId = await getDeviceId();

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('device_id', deviceId); // Security check

    if (error) {
      console.error('Error deleting review:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteReview:', error);
    return false;
  }
};

/**
 * Get average rating for a product
 */
export const getAverageRating = async (
  barcode: string
): Promise<{ average: number; count: number }> => {
  try {
    const reviews = await getReviewsByBarcode(barcode);

    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = reviews.reduce((acc, review) => acc + review.star_count, 0);
    const average = sum / reviews.length;

    return { average, count: reviews.length };
  } catch (error) {
    console.error('Error in getAverageRating:', error);
    return { average: 0, count: 0 };
  }
};
