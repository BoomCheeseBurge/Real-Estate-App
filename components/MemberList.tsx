import icons from "@/constants/icons";
import { User } from "@/lib/global-provider";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Models } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebouncedCallback } from "use-debounce";
import MemberCard from "./MemberCard";

interface MemberListProps {
    title: string;
    data: Models.MembershipList | never[] | null;
    user?: User;
}

export default function MemberList({title, data, user} : MemberListProps) {

    const listLen = data && !Array.isArray(data) ? data.total : (data ? data.length : 0);

    // Current visible members
    const [visibleCount, setVisibleCount] = useState(10);

    // Initialize params from the URL
    const params = useLocalSearchParams<{ query?: string }>();

    // Local state for the input field (immediate feedback)
    const [search, setSearch] = useState(params.query || "");
    
    // Filter the list based on the search query if needed
    // If data is null or a raw array, there are no memberships to filter
    const filteredMembers = (data && !Array.isArray(data) ? data.memberships : []).filter((member) => {
        const nameMatch = member.userName.toLowerCase().includes(search.toLowerCase());
        const emailMatch = member.userEmail.toLowerCase().includes(search.toLowerCase());
        
        return nameMatch || emailMatch;
    });

    // Slice the dummy data based on visibleCount
    const displayedMembers = filteredMembers?.slice(0, visibleCount);

    // Update to reflect the filtered results
    const hasMore = visibleCount < (filteredMembers?.length ?? 0);

    // Load more members if needed
    const handleLoadMore = () => {

        setVisibleCount((prev) => prev + 10);
    };

    // Debounce the search
    const debouncedSearch = useDebouncedCallback((text: string) => {
        router.setParams({ query: text }); // updates the URL search param
    }, 500);

    // Handle search input changes
    const handleSearchChange = (text: string) => {
        setSearch(text); // Update input field immediately
        debouncedSearch(text); // Update URL
    };

    return (
        <SafeAreaView>

            <View>
                <Text className="text-2xl font-extrabold text-gray-800 p-4 pt-6">
                    {title} ({listLen})
                </Text>

                <View className="flex flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-2 mx-4 my-2 shadow-sm">
                    <Image 
                        source={icons.search} 
                        className="size-5" 
                        style={{ tintColor: '#666876' }}
                    />

                    <TextInput 
                        value={search}
                        onChangeText={handleSearchChange}
                        placeholder="Search for anything"
                        placeholderTextColor="#666876"
                        className="text-sm font-rubik text-black-300 ml-2 flex-1"
                    />

                    {search.length > 0 && (
                        <TouchableOpacity 
                            onPress={() => handleSearchChange("")}
                            className="p-1"
                        >
                            <Image 
                                source={icons.clearSearch}
                                className="size-4" 
                                style={{ tintColor: '#666876' }} 
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            
            <FlatList
                data={displayedMembers}
                renderItem={({ item }) => <MemberCard member={item} currentUserId={user?.$id} />}
                keyExtractor={(item) => item.$id} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 200,
                }}
                ListEmptyComponent={() => (
                    <View className="flex-1 items-center justify-center mt-20 px-10">
                        <Image 
                            source={icons.emptyBox}
                            className="size-40" 
                            resizeMode="contain"
                            style={{ opacity: 0.5 }}
                        />
                        <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                            No {title} Found
                        </Text>
                        <Text className="text-sm font-rubik text-black-100 text-center mt-2">
                            We couldn't find any {title.toLowerCase()} matching your search query.
                        </Text>
                    </View>
                )}
                ListFooterComponent={() => {
                    // Dont show footer if list is empty
                    if (!displayedMembers || displayedMembers.length === 0) return null;

                    // Otherwise, show 'Load More' or 'No more to show'
                    return hasMore ? (
                        <TouchableOpacity 
                            onPress={handleLoadMore}
                            className="mx-4 my-6 p-4 bg-primary-100 rounded-xl items-center"
                        >
                            <Text className="text-primary-300 font-rubik-bold">Load More</Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="items-center my-6">
                            <Text className="text-gray-400 font-rubik">No more {title} to show</Text>
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
}