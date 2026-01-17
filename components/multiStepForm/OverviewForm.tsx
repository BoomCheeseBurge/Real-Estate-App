import { useFormContext } from "@/app/contexts/FormContext";
import icons from "@/constants/icons";
import { router } from "expo-router";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function OverviewForm() {

    const { formData, updateFormData, resetForm } = useFormContext();

    return (
        <View className="p-7 bg-white flex-1">
            <View className="flex flex-row justify-between items-center mb-5">
                <Text className="text-xl font-rubik-bold">Property Overview</Text>

                <TouchableOpacity 
                    className="rounded-full border border-primary-300 p-3"
                    onPress={() => {
                        resetForm(); // Clear form
                        router.replace('/') // Back to home page
                    }}
                >
                    <Image source={icons.home} className="size-5" />
                </TouchableOpacity>
            </View>

            {/* Property Type Dropdown */}
            <View className="mb-5">
                <TextInput
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={(text) => updateFormData({ description: text })}
                    value={formData.description}
                    className="border-[1px] p-4 border-gray-500 rounded-md min-h-[400px]"
                    style={{ textAlignVertical: 'top' }} 
                    placeholder="What is your property about?"
                />
            </View>
        </View>
    );
}