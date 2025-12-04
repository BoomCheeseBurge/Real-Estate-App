import { RegularCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { useAppwrite } from "@/hook/useAppwrite";
import { getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Explore() {

    // Global user state
    const { user, filters } = useGlobalContext();

    // Derive activeFilters ONLY from the global filters state
    const activeFilters = useMemo(() => {
        const filterArray = filters.filter;
        
        // Ensure the filter is an array and handle trimming/validity
        if (Array.isArray(filterArray)) {
            return filterArray.map(f => f.trim()).filter(f => f.length > 0);
        }

        // Default to ['All'] if the array is empty or undefined
        return ['All']; 
    }, [filters.filter]); // Dependency only on the filter array part of the global state

    // For modal to show along with bottom tabs
    // const [status, setStatus] = useState(false);

    // Fetch properties based on filter and search query
    const {
        data: properties,
        loading,
        refetch
    } = useAppwrite({
        fn: getProperties,
        params: {
            // filter: params.filter!,
            ...filters,
            filter: activeFilters!,
            query: filters.query!,
            limit: 6
        },
        skip: true
    });

    // Handle card press to navigate to property details
    const handleCardPress = (id: string) => router.push(`/properties/${id}`);

    // Refetch properties when filter or query changes
    useEffect(() => {
      
        refetch({
            // filter: params.filter!,
            filter: activeFilters!,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minBuilding: filters.minBuilding,
            maxBuilding: filters.maxBuilding,
            bedroomCount: filters.bedroomCount,
            bathroomCount: filters.bathroomCount,
            query: filters.query!,
            limit: 6
        });
    
    }, [
        activeFilters!,
        filters.minPrice,
        filters.maxPrice,
        filters.minBuilding,
        filters.maxBuilding,
        filters.bedroomCount,
        filters.bathroomCount,
        filters.query!,
    ]);

    return (
        <SafeAreaView className="bg-white h-full">

            {/* For modal to show along with bottom tabs */}
            {/* { status && <BottomSheet onClose={setStatus} /> } */}

            {/* Safelist is memory efficient */}
            <FlatList 
                data={properties} 
                renderItem={({ item }) => <RegularCard item={item} onPress={() => handleCardPress(item.id)} />} 
                keyExtractor={(item) => item.$id}
                numColumns={2}
                contentContainerClassName="pb-32"
                columnWrapperClassName="flex gap-5 px-5"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" className="text-primary-300 mt-5"/>
                    ) : <NoResults />
                }
                ListHeaderComponent={
                    <View className="px-5">
                        <View className="flex flex-row items-center justify-between mt-5">
                            {/* Return to home screen */}
                            <TouchableOpacity 
                            onPress={() => router.back()} 
                            className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center">
                                <Image source={icons.backArrow} className="size-5" />
                            </TouchableOpacity>

                            {/* Screen Title */}
                            <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                                Search for Your Ideal Home
                            </Text>

                            {/* Notifications */}
                            <Image source={icons.bell} className="w-6 h-6" />
                        </View>

                        {/* Search Feature */}
                        <Search />

                        {/* Property Filters */}
                        <View className="mt-5">
                            <Filters />

                            <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                                Found {properties?.length} properties
                            </Text>
                        </View>
                    </View>
                }
            />

        </SafeAreaView>
    );
}
