import { ADMIN_TILE, AGENT_TILE, USER_ROLES } from "@/constants/data";
import { useRouter } from "expo-router";
import { FlatList, Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

// --- Tile Item Component ---
const TileItem = ({ item, navigateTo }: {
    item: {
        id: string;
        label: string;
        icon: ImageSourcePropType;
        path: string;
    },
    navigateTo: (path: string) => void;
}) => {

    // Handle Tile Press
    const handlePress = () => {
        navigateTo(item.path);
    };

    return (
        // flex-1 ensures each tile takes up 1/3 of the row space
        <View className="flex-1 p-2">
            <TouchableOpacity
                onPress={handlePress}
                className="bg-[#1F2937] rounded-xl p-4 aspect-square items-center justify-center shadow-lg border border-gray-700/50"
            >
                <Image source={item.icon} className='size-8'/>
                
                <Text className="text-white text-sm font-semibold text-center mt-1 tracking-wider">
                    {item.label}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default function TileGrid({ role }: { role: string }) {

    // Initialize the router
    const router = useRouter(); 
    
    // Navigation handler
    const handleNavigate = (path: string) => {

        router.push(path as any);
    };

    return (
        <View className="w-full bg-gray-100 flex-1">
            <FlatList
                data={role === USER_ROLES.ADMIN ? ADMIN_TILE : AGENT_TILE}
                renderItem={({ item }) => <TileItem item={item} navigateTo={handleNavigate} />}
                keyExtractor={(item) => item.id}
                numColumns={3} // Maximum of three tiles per row
                contentContainerClassName="p-3" 
                columnWrapperClassName="flex justify-between"
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}