import { useUserLocationContext } from '@/app/contexts/UserLocationContext';
import icons from '@/constants/icons';
import React, { useState } from 'react';
import { Dimensions, Image, TextInput, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

export default function GoogleMapsSearch() {

    const { searchPlaceByQuery } = useUserLocationContext();

    // Set search state
    const [search, setSearch] = useState("");

    // Debounce the search input
    const debouncedSearch = useDebouncedCallback((text: string) => {
                                                    // Search place using Google Maps Places API
                                                    searchPlaceByQuery(text); 
                                                }, 500);

    // Handle search input change
    const handleSearchChange = (text: string) => {
        setSearch(text);
        // Do debounce
        debouncedSearch(text);
    }

    return (
        <View className='flex flex-row items-center justify-between w-fit px-4 rounded-lg bg-accent-100 border border-primary-100 py-2' style={{width: Dimensions.get('screen').width * 0.8}}>
            <Image source={icons.search} className='size-5'/>

            <TextInput 
                value={search}
                onChangeText={handleSearchChange}
                placeholder='Search for your property location'
                className='text-sm font-rubik text-black-300 ml-2 flex-1'
            />
        </View>
    )
}