import icons from '@/constants/icons';
import images from '@/constants/images';
import { DEFAULT_FILTERS, FilterParams, useGlobalContext } from '@/lib/global-provider';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';
import FilterCategories from './FilterCategories';
import MyModal from './MyModal';
import RangeSlider from './RangeSlider';
import RoomCount from './RoomCount';

// Define default constants
const MIN_PRICE = 1000;
const MAX_PRICE = 10000;
const MIN_BUILDING = 500;
const MAX_BUILDING = 5000;
const DEFAULT_BEDROOM = 1;
const DEFAULT_BATHROOM = 1;
const DEFAULT_CATEGORIES = ['All'];

const Search = () => {

    
    // Get the parameters from the path
    const params = useLocalSearchParams<{query?: string;}>();

    // ⭐ NEW: Get filters and setter from global context
    const { filters, setFilters } = useGlobalContext();

    // Set search from global filters, not URL params
    const [search, setSearch] = useState(filters.query);

    // Category State
    const [tempCategories, setTempCategories] = useState<string[]>(filters.filter || DEFAULT_CATEGORIES);

    // Price Range State
    // NOTE: If you need to read initial price from URL, you must add those params here.
    const [tempMinPrice, setTempMinPrice] = useState<number | undefined>(filters.minPrice);
    const [tempMaxPrice, setTempMaxPrice] = useState<number | undefined>(filters.maxPrice);
    
    // Building Size State
    const [tempMinBuilding, setTempMinBuilding] = useState<number | undefined>(filters.minBuilding);
    const [tempMaxBuilding, setTempMaxBuilding] = useState<number | undefined>(filters.maxBuilding);

    // Bedroom Count State
    const [tempBedroomCount, setTempBedroomCount] = useState<number | undefined>(filters.bedroomCount);
    const [tempBathroomCount, setTempBathroomCount] = useState<number | undefined>(filters.bathroomCount);

    // Filter modal visibility
    const [modalVisible, setModalVisible] = useState(false);

    // Debounce the search input
    const debouncedSearch = useDebouncedCallback((text: string) => {
                                                    // Update the global query filter
                                                    setFilters({ query: text }); 
                                                }, 500);

    // Handle search input change
    const handleSearchChange = (text: string) => {
        setSearch(text);
        // Do debounce
        debouncedSearch(text);
    }

    // Apply the filters
    const onSetFilter = () => {
        
        // Convert the array back to a comma-separated string for the URL
        const categoryString = tempCategories.join(',');

        const newFilters: Partial<FilterParams> = {
            filter: tempCategories,
            minPrice: tempMinPrice,
            maxPrice: tempMaxPrice,
            // ... include all other temp states
        };
        
        // Collect all parameters to be applied
        const newParams: { [key: string]: string | number | undefined } = {
            query: params.query,
            filter: categoryString,
            minPrice: tempMinPrice,
            maxPrice: tempMaxPrice,
            minBuilding: tempMinBuilding,
            maxBuilding: tempMaxBuilding,
            bedroomCount: tempBedroomCount,
            bathroomCount: tempBathroomCount,
        };
        
        // Update the URL and close the modal in one action
        router.setParams(newParams);
        setFilters(newFilters);
        setModalVisible(false);
    };

    // Reset all filter params
    const onResetFilter = () => {
        // 1. Reset temporary local state to defaults
        setTempCategories(DEFAULT_CATEGORIES);
        setTempMinPrice(undefined);
        setTempMaxPrice(undefined);
        setTempMinBuilding(undefined);
        setTempMaxBuilding(undefined);
        setTempBedroomCount(undefined);
        setTempBathroomCount(undefined);

        // 2. Clear filter-related URL parameters by setting them to undefined
        const newParams = {
            // MUST preserve the 'query' parameter
            query: params.query
        };

        router.setParams(newParams);
        setFilters(DEFAULT_FILTERS);
        setModalVisible(false);
    };

    // Synchrone All Filters
    useEffect(() => {

        if (modalVisible) {
            // --- Sync Categories ---
            setTempCategories(filters.filter || DEFAULT_CATEGORIES);
            
            // --- Sync Prices (Convert URL string to Number) ---
            setTempMinPrice(Number(filters.minPrice) || undefined);
            setTempMaxPrice(Number(filters.maxPrice) || undefined);

            // --- Sync Building Size (Convert URL string to Number) ---
            setTempMinBuilding(Number(filters.minBuilding) || undefined);
            setTempMaxBuilding(Number(filters.maxBuilding) || undefined);
            
            // --- Sync Room Counts (Convert URL string to Number) ---
            setTempBedroomCount(Number(filters.bedroomCount) || undefined);
            setTempBathroomCount(Number(filters.bathroomCount) || undefined);
        }
    }, [modalVisible]);

    return (
        <View className='flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2'>
            <MyModal 
                visible={modalVisible} 
                onClose={setModalVisible} 
                title="Filter" 
                onReset={onResetFilter}
                modalHeight='h-4/5'
            >
                
                <View className='flex-1'>
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        className='flex-grow pt-4'
                    >
                        {/* Price Range */}
                        <View className='w-full pr-5 mb-20 h-16'>
                            <View className='justify-center items-center'>
                                <View className='rounded-3xl'>
                                    <View className='flex gap-y-16'>
                                        <Text className='font-rubik-bold text-lg'>Price Range</Text>

                                        <Image 
                                            source={images.barChart}
                                            className='w-[300px] -top-0 -left-0 absolute'
                                            resizeMode='contain'
                                            >
                                        </Image>

                                        {/* Price Slider */}
                                            <RangeSlider 
                                                sliderWidth={300}
                                                initMin={MIN_PRICE}
                                                initMax={MAX_PRICE}
                                                min={tempMinPrice ?? MIN_PRICE}
                                                max={tempMaxPrice ?? MAX_PRICE}
                                                step={10}
                                                onValueChange={range => {
                                                    setTempMinPrice(Math.round(range.min));
                                                    setTempMaxPrice(Math.round(range.max));
                                                }}
                                                symbol='$'
                                            />
                                    </View>
                                
                                </View>
                            </View>
                        </View>

                        {/* Property Types */}
                        <View className='mb-2'>
                            <Text className='font-rubik-bold text-lg px-10'>Property Type</Text>

                            <FilterCategories
                                selectedCategories={tempCategories}
                                onSelectCategories={setTempCategories}
                            />
                        </View>

                        {/* Home Details */}
                        <View>
                            <Text className='font-rubik-bold text-lg px-10 mb-4'>Home Details</Text>

                            <RoomCount 
                                name='Bedrooms' 
                                minRoom={1} 
                                maxRoom={20} 
                                roomCount={tempBedroomCount! == undefined ? DEFAULT_BEDROOM : tempBedroomCount} 
                                setRoomCount={setTempBedroomCount} 
                            />
                            
                            <View className="border-b border-slate-200 my-4 w-5/6 self-center rounded-xl" />

                            <RoomCount 
                                name='Bathrooms' 
                                minRoom={1} 
                                maxRoom={10} 
                                roomCount={tempBathroomCount! == undefined ? DEFAULT_BATHROOM : tempBathroomCount} 
                                setRoomCount={setTempBathroomCount} 
                            />
                        </View>

                        {/* Building Size */}
                        <View className='w-full pr-5 mt-6 h-40'>
                            <View className='justify-center items-center'>
                                <View className='rounded-3xl'>
                                    <View className='flex gap-y-12'>
                                        <Text className='font-rubik-bold text-lg'>Building Size</Text>

                                        {/* Building Slider */}
                                            <RangeSlider 
                                                sliderWidth={300}
                                                initMin={MIN_BUILDING}
                                                initMax={MAX_BUILDING}
                                                min={tempMinBuilding ?? MIN_BUILDING} 
                                                max={tempMaxBuilding ?? MAX_BUILDING}
                                                step={10}
                                                onValueChange={range => {
                                                    setTempMinBuilding(Math.round(range.min));
                                                    setTempMaxBuilding(Math.round(range.max));
                                                }}
                                            />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                <TouchableOpacity 
                    onPress={onSetFilter}
                    className='bg-primary-300 rounded-full py-4 w-11/12 self-center absolute -bottom-16 z-50'
                >
                    <Text className='text-center text-white font-rubik-medium'>Set Filter</Text>
                </TouchableOpacity>
            </MyModal>

            <View className='flex-1 flex flex-row items-center justify-start z-50'>
                <Image source={icons.search} className='size-5'/>

                <TextInput 
                    value={search}
                    onChangeText={handleSearchChange}
                    placeholder='Search for anything'
                    className='text-sm font-rubik text-black-300 ml-2 flex-1'
                />
            </View>

            {/* Show additional filtering options if necessary */}
            {/* <TouchableOpacity onPress={() => openFilter && openFilter(true)}>
                <Image source={icons.filter} className='size-5'/>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={icons.filter} className='size-5'/>
            </TouchableOpacity>
        </View>
    )
}

export default Search;