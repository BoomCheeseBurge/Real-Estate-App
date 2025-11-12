import { ImageSliderType } from '@/constants/SliderData';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

type Props = {
    item: ImageSliderType;
    index: number;
    scrollX: SharedValue<number>;
}

const { width } = Dimensions.get('screen');

const SliderItem = ({ item, index, scrollX }: Props) => {

    const rnAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width], // Input range
                        [-width * 0.25, 0 ,width*0.25], // Output range
                        Extrapolation.CLAMP
                    )
                },
                {
                    scale: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width], // Input range
                        [0.9, 1, 0.9], // Output range
                        Extrapolation.CLAMP
                    )
                }
            ]
        }
    });

    return (
        <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
            <Image source={item.image} style={{width: width, height: 500, borderRadius: 20}} />

            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.1)']} style={styles.background}>
            </LinearGradient>

        </Animated.View>
    )
}

export default SliderItem

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        width: width,
    },
    background: {
        position: 'absolute',
        height: 500,
        width: width,
        padding: 20,
        borderRadius: 20,
        justifyContent: 'space-between',
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 1.5
    },
    description: {
        color: 'white',
        fontSize: 12,
        letterSpacing: 1.2
    },
    icon: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 5,
        borderRadius: 30,
    }
})