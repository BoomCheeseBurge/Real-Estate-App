import icons from '@/constants/icons';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Animated, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';

interface BottomSheetProps { 
    onClose: Dispatch<SetStateAction<boolean>>;
}

const BottomSheet = ({ onClose }: BottomSheetProps) => {

    const slideAnim = useRef(new Animated.Value(600)).current; // Initial value for opacity: 0

    const slideUp = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    const slideDown = () => {
        Animated.timing(slideAnim, {
            toValue: 600,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    // Slide up the bottom sheet when component mounts
    useEffect(() => {

      slideUp();
    }, []);

    // Close the modal
    const closeModal = () => {
        slideDown();

        setTimeout(() => {
            onClose(false);
        }, 500);
    }
    
    return (
        <Pressable onPress={closeModal} className='flex-1 absolute justify-end top-0 left-0 w-full h-full bg-modalBackdrop z-[100]'>
            {/* Second pressable component here to prevent closing when tapping inside the bottom sheet */}
            <Pressable className='h-4/5 w-full'>
                <Animated.View 
                    className='bg-white w-full h-full rounded-t-3xl'
                    style={{ transform: [{ translateY: slideAnim }] }}
                >
                    <View className='py-8 px-6'>
                        {/* Modal Header */}
                        <View className='justify-between flex-row w-full items-center mb-8'>
                            {/* Close modal */}
                            <TouchableOpacity 
                            onPress={closeModal} 
                            className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center">
                                <Image source={icons.backArrow} className="size-5" />
                            </TouchableOpacity>

                            {/* Modal Title */}
                            <Text className='font-rubik-bold text-lg'>Filter</Text>

                            {/* Reset Filters */}
                            <TouchableOpacity>
                                <Text className='text-primary-300 font-rubik-bold'>Reset</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Modal Body */}
                        <View>
                            <Text className='font-rubik-bold text-lg'>Price Range</Text>
                        </View>
                    </View>
                </Animated.View>
            </Pressable>
        </Pressable>
    )
}

export default BottomSheet