import { ImageSliderType } from '@/constants/SliderData';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

type Props = {
    items: ImageSliderType[];
    paginationIndex: number;
    scrollX: SharedValue<number>;
}

const { width } = Dimensions.get('screen');

const SliderPagination = ({ items, paginationIndex, scrollX }: Props) => {
  return (
    <View style={styles.container}>
      {items.map((_, index) => {

        const pgAnimationStyle = useAnimatedStyle(() => {
            
            const dotWidth = interpolate(
                scrollX.value % (items.length * width),
                [(index - 1) * width, index * width, (index + 1) * width], // Input range
                [8, 20, 8], // Output range
                Extrapolation.CLAMP
            );

            return {
                width: dotWidth
            }
        });

        return (
            <Animated.View 
                key={index} 
                style={[styles.dot, pgAnimationStyle, {backgroundColor: paginationIndex === index ? '#007AFF' : '#FFFFFF'}]}
            />
        );
      })}
    </View>
  )
}

export default SliderPagination

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -100,
    },
    dot: {
        backgroundColor: '#595959',
        height: 8,
        width: 8,
        marginHorizontal: 2,
        borderRadius: 8,
    }
})