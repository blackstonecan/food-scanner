import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StarRatingProps {
  rating: number; // 0-5, can be decimal
  size?: number;
  showNumber?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 20,
  showNumber = false,
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push('★'); // Full star
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push('⯨'); // Half star
    } else {
      stars.push('☆'); // Empty star
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.stars, { fontSize: size }]}>{stars.join('')}</Text>
      {showNumber && (
        <Text style={[styles.number, { fontSize: size * 0.7 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    color: '#FFD700', // Gold color
    letterSpacing: 2,
  },
  number: {
    color: '#888',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default StarRating;
