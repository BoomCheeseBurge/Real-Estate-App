import RoleBadge from "@/components/RoleBadge";
import TileGrid from "@/components/TileGrid";
import { useGlobalContext } from "@/lib/global-provider";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {

    const { user, refetch, admin } = useGlobalContext();

    return (
        <SafeAreaView className='h-full bg-primary-400'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-32 flex-grow"
            >
                {/* Profile Header */}
                <View className='flex items-center justify-between mt-5'>
                    <Text className='text-xl font-rubik-bold text-white text-center'>
                        Dashboard
                    </Text>

                    {/* AVATAR Section */}
                    <View className='flex flex-row items-center justify-start relative w-full my-8 gap-x-6 pl-8'>
                        {/* Avatar Image */}
                        <Image source={{ uri: user?.avatar }} className='size-16 bg-white relative rounded-full'/>

                        {/* Display Name */}
                        <View>
                            <Text className='text-2xl font-rubik-bold mt-2 text-white mb-2'>
                                {user?.name}
                            </Text>

                            <RoleBadge role={admin ? "admin" : "agent"} />
                        </View>
                    </View>
                </View>
                
                <TileGrid role={admin ? "admin" : "agent"} />
            </ScrollView>
        </SafeAreaView>
    );
}