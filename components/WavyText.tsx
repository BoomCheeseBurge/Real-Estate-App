import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const WavyText = ({ text }: { text: string }) => {
  const letters = text.split('');
  // Create an array of animated values, one for each letter
  const animatedValues = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = letters.map((_, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValues[i], {
            toValue: -3, // Move up
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues[i], {
            toValue: 0, // Move back down
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    });

    // Start animations with a 100ms stagger between each letter
    Animated.stagger(100, animations).start();
  }, [animatedValues, letters]);

  return (
    <View className="flex-row">
      {letters.map((letter, index) => (
        <Animated.Text
          key={index}
          className="text-primary-300 font-rubik-bold text-lg"
          style={{
            transform: [{ translateY: animatedValues[index] }],
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </Animated.Text>
      ))}
    </View>
  );
};

export default WavyText;