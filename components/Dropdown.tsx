import icons from '@/constants/icons';
import React, { useCallback, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

type Option = {
    value: string;
    label: string;
}

interface DropdownProps {
    placeholder: string;
    data: Option[];
    value?: string;
    onChange: (item: Option) => void;
    disabled?: boolean;
}

function Dropdown({ 
    placeholder, 
    data, 
    value: initialValue, 
    onChange, 
    disabled 
} : DropdownProps) {
    const [expanded, setExpanded] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(() => {
        const found = data.find(item => item.value === initialValue);
        return found ? found.label : '';
    });

    const toggleExpanded = useCallback(() => {
        if (!disabled) setExpanded(!expanded);
    }, [expanded, disabled]);

    const onSelect = useCallback((item: Option) => {
        onChange(item);
        setSelectedLabel(item.label);
        setExpanded(false);
    }, [onChange]);

    return (
        /* Elevated zIndex ensures the menu floats above subsequent form fields */
        <View className='relative' style={{ zIndex: expanded ? 1000 : 1 }}>
            
            {/* Dropdown Trigger Button */}
            <TouchableOpacity 
                className='h-12 justify-between flex-row bg-white w-full items-center px-4 rounded-lg border border-slate-200' 
                activeOpacity={0.8}
                onPress={toggleExpanded}
                disabled={disabled}
            >
                <Text className={`text-sm ${selectedLabel ? 'text-black-300' : 'text-black-100 opacity-50'}`}>
                    {selectedLabel || placeholder}
                </Text>
                <Image 
                    source={icons.caretDown} 
                    className={`size-3 ${expanded ? 'rotate-180' : 'rotate-0'}`} 
                    style={{ tintColor: '#666876' }}
                />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {expanded && (
                <>
                    {/* Backdrop to close menu when clicking elsewhere */}
                    <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
                        <View style={{ position: 'absolute', width: 2000, height: 2000, left: -1000, top: -1000 }} />
                    </TouchableWithoutFeedback>

                    <View 
                        className='bg-white w-full rounded-md shadow-lg border border-slate-100 absolute overflow-hidden'
                        style={{ 
                            top: '110%', 
                            maxHeight: 200,
                            elevation: 5, // Extra shadow for Android
                        }}
                    >
                        <ScrollView bounces={false} nestedScrollEnabled={true}>
                            {data.map((item) => (
                                <TouchableOpacity 
                                    key={item.value}
                                    className='h-12 justify-center px-4 border-b border-slate-50 active:bg-slate-100'
                                    onPress={() => onSelect(item)}
                                >
                                    <Text className='text-sm text-black-300'>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </>
            )}
        </View>
    )
}

export default Dropdown;