import icons from "@/constants/icons";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Upload() {

    return (
        <SafeAreaView className='h-full bg-white'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-32 px-7"
            >
                {/* Header */}
                <View className='flex flex-row items-center justify-between mt-5'>
                    <Text className='text-xl font-rubik-bold'>
                        New Property
                    </Text>

                    <Image source={icons.bell} className='size-5'/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}