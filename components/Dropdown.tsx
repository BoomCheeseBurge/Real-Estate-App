import icons from '@/constants/icons';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, Image, Modal, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

type Option = {
    value: string;
    label: string;
}

interface DropdownProps {
    placeholder: string;
    data: Option[];
    onChange: (item: Option) => void;
    disabled?: boolean;
}

function Dropdown({ 
    placeholder, 
    data, 
    onChange, 
    disabled 
} : DropdownProps) {

    const [expanded, setExpanded] = useState(false);

    const [top, setTop] = useState(0);

    const [value, setValue] = useState('');

    const toggleExpanded = useCallback(() => {
        if (!disabled) setExpanded(!expanded);
    }, [expanded, disabled]);

    const onSelect = useCallback((item: Option) => {

        // Set the value of the selected item
        onChange(item);
        // Set the label of the dropdown
        setValue(item.label);
        // Close the dropdown
        setExpanded(false);
    }, []);

    const buttonRef = useRef<View>(null);

    return (
        <View 
            ref={buttonRef}
            onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                const topOffset = layout.y;
                const heightOfComponent = layout.height;

                const finalTop = topOffset + heightOfComponent + (Platform.OS === 'android' ? 420 : 3)

                setTop(finalTop);
            }}
        >
            {/* Button to expand the dropdown list */}
            <TouchableOpacity 
                className='h-12 justify-between flex-row bg-white w-full items-center px-4 rounded-lg' 
                activeOpacity={0.8}
                onPress={toggleExpanded}
            >
                <Text className='text-sm opacity-50'>{value || placeholder}</Text>

                <Image source={icons.caretDown} className={`size-3 ${expanded ? 'rotate-180' : 'rotate-0'}`} />
            </TouchableOpacity>

            {/* Dropdown list */}
            {expanded && (
                <Modal visible={expanded} transparent>
                    <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
                        <View className='p-5 justify-center items-center flex-1'>
                            <View className='bg-white w-full p-2 mt-1 rounded-md max-h-60 absolute' style={{top: top}}>
                                <FlatList 
                                    keyExtractor={(item) => item.value}
                                    data={data}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity 
                                            activeOpacity={0.8} 
                                            className='h-11 justify-center pl-4'
                                            onPress={() => onSelect(item)}
                                        >
                                            <Text>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => <View className='h-2' />}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    )
}

export default Dropdown;