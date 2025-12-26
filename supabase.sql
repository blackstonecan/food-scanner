-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL,
    barcode TEXT NOT NULL,
    content TEXT NOT NULL,
    star_count INTEGER NOT NULL CHECK (
        star_count >= 1
        AND star_count <= 5
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_device_product UNIQUE (device_id, barcode)
);

-- Create indexes for performance
CREATE INDEX idx_reviews_barcode ON reviews(barcode);

CREATE INDEX idx_reviews_device_id ON reviews(device_id);

CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE
    reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all operations for simplicity)
CREATE POLICY "Anyone can view reviews" ON reviews FOR
SELECT
    USING (true);

CREATE POLICY "Users can insert their own reviews" ON reviews FOR
INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own reviews" ON reviews FOR
UPDATE
    USING (true);

CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (true);

-- Auto-update updated_at timestamp
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

CREATE TRIGGER update_reviews_updated_at BEFORE
UPDATE
    ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();