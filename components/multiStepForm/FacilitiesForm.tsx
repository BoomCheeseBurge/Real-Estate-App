import { useFormContext } from "@/app/contexts/FormContext";
import { facilities } from "@/constants/data"; // Import your actual constant
import icons from "@/constants/icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function FacilitiesForm() {

    const { formData, updateFormData, resetForm } = useFormContext();

    // Toggle facility selection
    const toggleFacility = (facilityLabel: string) => {

        const isSelected = formData.facilities.includes(facilityLabel);
        
        // If already selected, remove it; otherwise, add it
        if (isSelected) {
            updateFormData({
                facilities: formData.facilities.filter((f) => f !== facilityLabel),
            });
        } else {
            updateFormData({
                facilities: [...formData.facilities, facilityLabel],
            });
        }
    };

    return (
        <ScrollView className="p-7 bg-white flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex flex-row justify-between items-center mb-2">
                <Text className="text-xl font-rubik-bold">Facilities</Text>

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

            <Text className="text-sm font-rubik text-black-100 mb-6">
                Select the facilities available at your property.
            </Text>

            <View className="flex-row flex-wrap justify-between pb-10">
                {facilities.map((facility) => {
                    // Check selection based on the label
                    const isSelected = formData.facilities.includes(facility.label);

                    return (
                        <TouchableOpacity
                            key={facility.label}
                            onPress={() => toggleFacility(facility.label)}
                            activeOpacity={0.8}
                            className={`w-[48%] mb-4 p-4 rounded-2xl border flex-row items-center gap-x-3 ${
                                isSelected 
                                ? "bg-primary-300 border-primary-300" 
                                : "bg-slate-50 border-slate-200"
                            }`}
                        >
                            <Image 
                                source={facility.icon} 
                                className="size-5"
                                // Use tintColor to make the icon white when selected
                                style={{ tintColor: isSelected ? "white" : "#666876" }}
                            />
                            
                            <Text 
                                className={`font-rubik-medium text-xs flex-1 ${
                                    isSelected ? "text-white" : "text-black-300"
                                }`}
                            >
                                {facility.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}