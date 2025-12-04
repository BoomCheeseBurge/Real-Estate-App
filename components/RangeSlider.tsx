import React from 'react';
import { TextInput, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

interface RangeSliderProps {
    sliderWidth: number;
    initMin: number;
    initMax: number;
    min: number;
    max: number;
    step: number;
    onValueChange: (range: { min: number; max: number }) => void;
    symbol?: string;
}


const RangeSlider = ({ 
    sliderWidth, 
    initMin,
    initMax,
    min, 
    max, 
    step, 
    onValueChange,
    symbol = ''
}: RangeSliderProps) => {

    const ABS_RANGE = initMax - initMin;
    const STEP_SIZE = sliderWidth / (ABS_RANGE / step); // Pixels per step

    // ------------------

    const position = useSharedValue(0);
    const position2 = useSharedValue(sliderWidth);
    const opacity = useSharedValue(0);
    const opacity2 = useSharedValue(0);
    const zIndex = useSharedValue(0);
    const zIndex2 = useSharedValue(0);
    const context = useSharedValue(0);
    const context2 = useSharedValue(0);

    // Using new Gesture API
    const pan = Gesture.Pan()
        .onBegin(() => {
            context.value = position.value;
        })
        .onUpdate(e => {
            // opacity.value = 1;
            if (context.value + e.translationX < 0) {

                position.value = 0;
            } else if (context.value + e.translationX > position2.value) {

                position.value = position2.value;
                zIndex.value = 1;
                zIndex2.value = 0;
            } else {

                position.value = context.value + e.translationX;
            }
        })
        .onEnd(() => {
            // opacity.value = 0;
            scheduleOnRN(onValueChange, {
                min:
                initMin +
                Math.floor(position.value / (sliderWidth / ((initMax - initMin) / STEP_SIZE))) *
                    STEP_SIZE,
                max:
                initMin +
                Math.floor(position2.value / (sliderWidth / ((initMax - initMin) / STEP_SIZE))) *
                    STEP_SIZE,
            });
        });
        // .onEnd(() => {
        //     // opacity.value = 0;
        //     scheduleOnRN(onValueChange, {
        //         min:
        //         min +
        //         Math.floor(position.value / (sliderWidth / ((max - min) / step))) *
        //             step,
        //         max:
        //         min +
        //         Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
        //             step,
        //     });
        // });

    const pan2 = Gesture.Pan()
        .onBegin(() => {

            context2.value = position2.value;
        })
        .onUpdate(e => {
            // opacity2.value = 1;
            if (context2.value + e.translationX > sliderWidth) {

                position2.value = sliderWidth;
            } else if (context2.value + e.translationX < position.value) {

                position2.value = position.value;
                zIndex.value = 0;
                zIndex2.value = 1;
            } else {

                position2.value = context2.value + e.translationX;
            }
        })
        .onEnd(() => {
            // opacity2.value = 0;
            scheduleOnRN(onValueChange, {
                min:
                initMin +
                Math.floor(position.value / (sliderWidth / ((initMax - initMin) / STEP_SIZE))) *
                    STEP_SIZE,
                max:
                initMin +
                Math.floor(position2.value / (sliderWidth / ((initMax - initMin) / STEP_SIZE))) *
                    STEP_SIZE,
            });
        });
        // .onEnd(() => {
        //     // opacity2.value = 0;
        //     scheduleOnRN(onValueChange, {
        //         min:
        //         min +
        //         Math.floor(position.value / (sliderWidth / ((max - min) / step))) *
        //             step,
        //         max:
        //         min +
        //         Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
        //             step,
        //     });
        // });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: position.value}],
        zIndex: zIndex.value,
    }));

    const animatedStyle2 = useAnimatedStyle(() => ({
        transform: [{translateX: position2.value}],
        zIndex: zIndex2.value,
    }));

    const opacityStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const opacityStyle2 = useAnimatedStyle(() => ({
        opacity: opacity2.value,
    }));

    const sliderStyle = useAnimatedStyle(() => ({
        transform: [{translateX: position.value}],
        width: position2.value - position.value,
    }));

    const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

    const minLabelText = useAnimatedProps(() => {
        return {
        text: `${symbol}${
            initMin +
            Math.floor(position.value / STEP_SIZE) * step
            // min +
            // Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step
        }`,
        };
    });

    const maxLabelText = useAnimatedProps(() => {
        return {
        text: `${symbol}${
            initMin +
            Math.floor(position2.value / STEP_SIZE) * step
            // min +
            // Math.floor(position2.value / (sliderWidth / ((max - min) / step))) * step
        }`,
        };
    });

    // ⭐ NEW EFFECT: Translate incoming selected min/max values to initial pixel positions
    React.useEffect(() => {
        // Calculate position based on current 'min' and 'max' props
        // The props 'min' and 'max' now hold the SELECTED filter values (e.g., 1000 and 1490)
        
        // Only run if the props are different from the ABS defaults (or if the initial value is set)
        
        const newPosition = (min - initMin) / step * STEP_SIZE;
        const newPosition2 = (max - initMin) / step * STEP_SIZE;

        // Set the initial positions on mount or when props change
        position.value = newPosition;
        position2.value = newPosition2;

    }, [min, max, sliderWidth, step]); // Dependencies on the props holding the selected values

    return (
        <View 
            className='justify-center self-center'
            style={[{width: sliderWidth}]}
        >

            <View 
                className='h-2 bg-sky-200 rounded-3xl'
                style={[{width: sliderWidth}]} 
            />
            
            <Animated.View
                className='h-2 bg-primary-300 rounded-3xl absolute' 
                style={[sliderStyle]} 
            />
           
            <GestureDetector gesture={pan}>
                <Animated.View
                    className='-left-2 w-6 h-6 absolute bg-white border-primary-300 border-4 rounded-3xl' 
                    style={[animatedStyle]}
                >
                    <Animated.View 
                        className='absolute top-full mt-3 bg-white rounded-3xl self-center justify-center items-center'
                        // style={[opacityStyle]}
                    >
                        <AnimatedTextInput
                        className='text-primary-300 p-1 font-rubik-bold text-base w-full mx-1 text-center'
                        animatedProps={minLabelText}
                        editable={false}
                        defaultValue={`${symbol}${
                            initMin +
                            Math.floor(
                                position.value / STEP_SIZE,
                            ) * step
                            // min +
                            // Math.floor(
                            //     position.value / (sliderWidth / ((max - min) / step)),
                            // ) * step
                        }`}
                        />
                    </Animated.View>
                </Animated.View>
            </GestureDetector>
            
            
            <GestureDetector gesture={pan2}>
                
                <Animated.View
                    className='-left-2 w-6 h-6 absolute bg-white border-primary-300 border-4 rounded-3xl' 
                    style={[animatedStyle2]}
                >
                    <Animated.View 
                        className='absolute -top-11 bottom-5 bg-white rounded-3xl self-center justify-center items-center'
                        // style={[opacityStyle2]}
                    >
                        <AnimatedTextInput
                        className='text-primary-300 p-1 font-rubik-bold text-base w-full mx-1 text-center'
                        animatedProps={maxLabelText}
                        editable={false}
                        defaultValue={`${symbol}${
                            min +
                            Math.floor(
                            position2.value / STEP_SIZE,
                            ) * step
                            // min +
                            // Math.floor(
                            // position2.value / (sliderWidth / ((max - min) / step)),
                            // ) * step
                        }`}
                        />
                    </Animated.View>
                </Animated.View>
            </GestureDetector>
        </View>
    )
}

export default RangeSlider