import icons from '@/constants/icons';
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from 'react';
import { Animated, Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface BottomSheetProps { 
    onClose: Dispatch<SetStateAction<boolean>>;
    visible: boolean;
    title: string;
    onReset?: () => void;
    children: ReactNode;
}

const MyModal = ({ onClose, visible, title, onReset, children }: BottomSheetProps) => { // <-- Destructure visible prop

    // Slide animation value
    const slideAnim = useRef(new Animated.Value(600)).current; // Initial value for opacity: 0

    // Slide up animation
    const slideUp = () => {

        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();

    }

    // Slide down animation
    const slideDown = () => {

        Animated.timing(slideAnim, {
            toValue: 600,
            duration: 500,
            useNativeDriver: true,
        }).start();

    }

    // Close the modal function now just starts the slide down and calls onClose
    const closeModal = () => {
        slideDown();
    }
    
    // Use an effect to automatically close the modal after the slideDown animation finishes
    useEffect(() => {
        if (!visible) {
             // If the component is told to hide (visible becomes false), run the slide-down animation
             slideDown();
        } else {
             slideUp(); // Slide up when component mounts/becomes visible
        }
    }, [visible]);

    // **Crucially, the slideDown logic needs adjustment for Modal**
    // In your original code, the component unmounted after the timeout (500ms).
    // With Modal, you need the animation to finish BEFORE setting `visible: false`.
    
    const closeModalHandler = () => {
        // 1. Start the slide down animation
        Animated.timing(slideAnim, {
            toValue: 600,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            // 2. ONLY set visibility to false AFTER the animation is complete
            onClose(false); 
        });
    }


    return (
        <Modal
            animationType="none" // Handle the animation manually
            transparent={true} 
            visible={visible} 
            onRequestClose={closeModalHandler} // Handles Android back button
        >
            <GestureHandlerRootView>
                {/* The full-screen backdrop replaces your original absolute Pressable */}
                <Pressable 
                    onPress={closeModalHandler} 
                    className='flex-1 justify-end top-0 left-0 w-full h-full bg-modalBackdrop z-[100]'
                >
                    {/* Second pressable component here to prevent closing when tapping inside the bottom sheet */}
                    <View className='h-4/5 w-full' onStartShouldSetResponder={() => true}>
                        {/* The Animated.View remains the same, handling the content slide */}
                        <Animated.View 
                            className='bg-white w-full h-full rounded-t-3xl'
                            style={{ transform: [{ translateY: slideAnim }] }}
                        >
                            <View>
                                {/* Modal Header */}
                                <View className='justify-between flex-row w-full items-center px-4 py-6'>
                                    {/* Item 1: Close modal (Positioned Left by default flex flow) */}
                                        <TouchableOpacity 
                                        onPress={closeModal} 
                                        className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center z-10">
                                            <Image source={icons.backArrow} className="size-5" />
                                        </TouchableOpacity>

                                        {/* Item 2: Modal Title (ABSOLUTE POSITIONING) */}
                                        <Text 
                                            className='font-rubik-bold text-lg absolute self-center text-center' 
                                            style={{ left: 0, right: 0 }} // Stretch across the full container width
                                        >
                                            {title}
                                        </Text>

                                        {/* Item 3: Reset Filters (Conditional Rendering) */}
                                        {/* If onReset is optional, you conditionally render the whole button: */}
                                        {onReset && (
                                            <TouchableOpacity onPress={onReset} className="z-10">
                                                <Text className='text-primary-300 font-rubik-bold'>Reset</Text>
                                            </TouchableOpacity>
                                        )}
                                </View>

                                {/* Modal Body */}
                                <View className='h-[475px] relative'>
                                    {children}
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                </Pressable>
            </GestureHandlerRootView>
        </Modal>
    )
}

export default MyModal;