export interface Review {
  id: string;
  device_id: string;
  barcode: string;
  content: string;
  star_count: number; // 1-5
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

export interface CreateReviewInput {
  barcode: string;
  content: string;
  star_count: number;
}

export interface UpdateReviewInput {
  content?: string;
  star_count?: number;
}

export interface ReviewWithProduct extends Review {
  // Optional: populated from local data or API
  productName?: string;
  productBrand?: string;
  productImage?: string;
}
