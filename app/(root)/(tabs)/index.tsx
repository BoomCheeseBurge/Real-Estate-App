import { FeaturedCard, RegularCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { useAppwrite } from "@/hook/useAppwrite";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

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

    // const [modalVisible, setModalVisible] = useState(false);

    // Fetch latest properties
    const {
        data: latestProperties,
        loading: latestPropertiesLoading
    } = useAppwrite({
        fn: getLatestProperties
    });

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

            {/* Safelist is memory efficient */}
            <FlatList 
                data={properties} 
                renderItem={({ item }) => <RegularCard item={item} onPress={() => handleCardPress(item.$id)} />} 
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
                        {/* HEADER Section */}
                        <View className="flex flex-row items-center justify-between mt-5">
                            <View className="flex flex-row items-center">
                                <Image source={{ uri: user?.avatar }} className="size-12 rounded-full"/>
                                
                                <View className="flex flex-col items-start ml-2 justify-center">
                                    <Text className="text-xs font-rubik text-black-100">Good Morning</Text>

                                    <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
                                </View>
                            </View>

                            <Image source={icons.bell} className="size-6"/>
                        </View>

                        {/* SEARCH Section */}
                        <Search />

                        {/* FEATURED Section */}
                        <View className="my-5">
                            <View className="flex flex-row items-center justify-between">
                                <Text className="text-xl font-rubik-bold text-black-300">
                                    Featured
                                </Text>

                                <TouchableOpacity>
                                    <Text className="text-base font-rubik-bold text-primary-300">
                                        See All
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Handle for loading, empty, or populated state */}
                            {latestPropertiesLoading ? 
                                <ActivityIndicator size="large" className="text-primary-300"/>
                            : !latestProperties || latestProperties.length === 0 ? 
                            <NoResults /> : (
                                <FlatList 
                                    data={latestProperties}
                                    renderItem={({item}) => <FeaturedCard item={item} onPress={() => handleCardPress(item.$id)} />}
                                    keyExtractor={(item) => item.$id}
                                    horizontal
                                    // Prevents vertical scroll from interfering with horizontal scroll
                                    bounces={false}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerClassName="flex gap-5 mt-5"
                                />
                            )}
                        </View>

                        {/* RECOMMENDATIONS Section */}
                        <View className="flex flex-row items-center justify-between">
                            <Text className="text-xl font-rubik-bold text-black-300">
                                Our Recommendations
                            </Text>

                            <TouchableOpacity>
                                <Text className="text-base font-rubik-bold text-primary-300">
                                    See All
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Filters />
                    </View>
                }
            />

        </SafeAreaView>
    );
}