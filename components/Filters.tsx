import { categories } from '@/constants/data';
import { useGlobalContext } from '@/lib/global-provider';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

const Filters = () => {

    // Global filters and setter
    const { filters, setFilters } = useGlobalContext();

    // Use filters.filter directly from global state, which is already a string[] | undefined
    const globalFilterArray = filters.filter || ['All'];

    // Helper to normalize the filter array from global state.
    const activeFilters = useMemo(() => {
        
        const cleaned = globalFilterArray
            .map(f => f.trim())
            .filter(f => f.length > 0);
        
        // ensure ['All'] value if array is empty or only contains 'All'
        if (cleaned.length === 0 || (cleaned.length === 1 && cleaned[0] === 'All')) {
            return ['All'];
        }

        // Return all selected filters, excluding 'All' if other filters are present
        return cleaned.filter(f => f !== 'All');
        
    }, [globalFilterArray]); // Dependency is now the global filter array

    const handleCategoryPress = (category: string) => {
        
        let newFilters: string[];

        if (category === 'All') {
            // Clicking 'All' clears everything else.
            newFilters = ['All'];
        } else if (activeFilters.includes(category)) {
            // Toggling OFF: Remove the category from the selection.
            newFilters = activeFilters.filter(f => f !== category);
            
            // If the last category is removed, default back to 'All'
            if (newFilters.length === 0) {
                 newFilters = ['All'];
            }
        } else {
            // Toggling ON: Add the new category and remove 'All' if present.
            newFilters = [...activeFilters.filter(f => f !== 'All'), category];
        }

        // Update global state by passing the new filter array
        setFilters({ filter: newFilters });
    }
        
    return (
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className='mt-3 mb-2'
            >
            {categories.map((item, index) => {
                const isSelected = item.category === 'All' 
                    ? activeFilters.includes('All') && activeFilters.length === 1 // Only 'All' is selected
                    : activeFilters.includes(item.category) && !activeFilters.includes('All'); // Other category selected

                return (
                    <TouchableOpacity 
                        key={index} 
                        className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${isSelected ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}`} 
                        onPress={() => handleCategoryPress(item.category)}
                    >
                        <Text className={`text-sm ${isSelected ? 'text-white font-rubik-bold mt-0.5' : 'text-black-300 font-rubik'}`}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
            </ScrollView>
    )
}

export default Filters