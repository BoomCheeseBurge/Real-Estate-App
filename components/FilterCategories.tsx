import { categories } from '@/constants/data';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FilterCategoriesProps {
    selectedCategories: string[]; // Read current state
    onSelectCategories: (categories: string[]) => void; // Update parent state
}


const FilterCategories = ({ selectedCategories, onSelectCategories }: FilterCategoriesProps) => {

    // Helper constants for URL param conversion
    const ALL_CATEGORY = 'All';

    // Helper function to check if a category is currently selected
    const isSelected = (category: string) => selectedCategories.includes(category);

    const handleCategoryPress = (category: string) => {

        let newCategories = [...selectedCategories];

        if (category === ALL_CATEGORY) {
            // Case A: User selected 'All' -> Reset to just ['All']
            newCategories = [ALL_CATEGORY];

        } else if (isSelected(category)) {
            // Case B: Category is already selected -> Remove it
            newCategories = newCategories.filter(cat => cat !== category && cat !== ALL_CATEGORY);
            
            // If we removed the last category (and it wasn't 'All'), default back to ['All']
            if (newCategories.length === 0) {
                newCategories.push(ALL_CATEGORY);
            }

        } else {
            // Case C: Category is NOT selected -> Add it
            // Remove 'All' if it's currently present before adding the new category
            newCategories = newCategories.filter(cat => cat !== ALL_CATEGORY);
            newCategories.push(category);
        }

        onSelectCategories(newCategories);
    };
            
    return (
        <View className='flex flex-row flex-wrap mt-3 mb-2 pl-5'>
            {categories.map((item, index) => (
                <TouchableOpacity 
                    key={index} 
                    className={`w-fit px-8 py-1.5 mr-8 mb-2.5 rounded-full ${isSelected(item.category) ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}`} 
                    onPress={() => handleCategoryPress(item.category)}
                >
                    <Text className={`text-sm ${isSelected(item.category) ? 'text-white font-rubik-bold mt-0.5' : 'text-black-300 font-rubik'}`}>
                        {item.title}
                    </Text>
                </TouchableOpacity>
            ))} 
        </View>
    )
}

export default FilterCategories