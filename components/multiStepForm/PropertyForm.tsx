import { useFormContext } from "@/app/contexts/FormContext";
import { categories } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { router } from "expo-router";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Dropdown from "../Dropdown";
import ImagePickerButton from "../ImagePickerButton";

export default function PropertyForm() {

    const { formData, updateFormData, resetForm } = useFormContext();
    
    return(
        <ScrollView 
            contentContainerClassName="p-7 pb-36 gap-y-10"
            showsVerticalScrollIndicator={false}
        >
            <View className="flex flex-row justify-between items-center">
                <Text className="text-xl font-rubik-bold">Property Details</Text>

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

            {/* Property Name */}
            <View>
                <Text className="text-sm font-rubik-medium text-black-300 mb-2">Property Name</Text>
                <TextInput 
                    value={formData.propertyName}
                    onChangeText={(text) => updateFormData({ propertyName: text })}
                    placeholder="enter name here..."
                    keyboardType="default"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300"
                />
            </View>

            {/* Property Images */}
            <View className="flex-col flex">
                <Text className="text-sm font-rubik-bold mb-2">
                    Upload Property Images
                </Text>

                <ImagePickerButton />
            </View>

            {/* Property Category */}
            <View>
                <Text className="text-sm font-rubik-medium text-black-300 mb-2">Property Type</Text>
                <Dropdown 
                    placeholder="Select Type"
                    data={categories}
                    onChange={(item) => updateFormData({ propertyType: item.value })}
                />
            </View>

            {/* Bed and Bath Count */}
            <View className="flex-row gap-x-4">
                <View className="flex-1">
                    <Text className="text-sm font-rubik-medium text-black-300 mb-2">Beds</Text>
                    <TextInput 
                        value={formData.beds}
                        onChangeText={(text) => updateFormData({ beds: text })}
                        placeholder="0"
                        keyboardType="numeric"
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300"
                    />
                </View>

                <View className="flex-1">
                    <Text className="text-sm font-rubik-medium text-black-300 mb-2">Bathrooms</Text>
                    <TextInput 
                        value={formData.bathrooms}
                        onChangeText={(text) => updateFormData({ bathrooms: text })}
                        placeholder="0"
                        keyboardType="numeric"
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300"
                    />
                </View>
            </View>

            {/* Property Area Size */}
            <View>
                <Text className="text-sm font-rubik-medium text-black-300 mb-2">Area Size (sqft)</Text>
                <TextInput 
                    value={formData.areaSize}
                    onChangeText={(text) => updateFormData({ areaSize: text })}
                    placeholder="e.g. 1500"
                    keyboardType="numeric"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300"
                />
            </View>

            {/* Location Section */}
            <View>
                <Text className="text-black-300 text-xl font-rubik-bold">
                    Location
                </Text>

                <View className="flex flex-row items-center justify-start mt-4 gap-2">
                    <Image source={icons.location} className="w-7 h-7" />

                    <Text className="text-black-200 text-sm font-rubik-medium">
                        {/* property address placeholder for now */}
                        123 Property Street, City 1
                    </Text>
                </View>

                <Image
                    source={images.map}
                    className="h-52 w-full mt-5 rounded-xl"
                />
            </View>
        </ScrollView>
    );
}