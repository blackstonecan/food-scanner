import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface StarRatingInputProps {
  value: number; // 1-5
  onChange: (value: number) => void;
  size?: number;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  size = 40,
}) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onChange(star)}
          style={styles.starButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.star, { fontSize: size }]}>
            {star <= value ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starButton: {
    padding: 4,
  },
  star: {
    color: '#FFB300', // Warm gold color
  },
});

export default StarRatingInput;
