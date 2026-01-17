import { useFormContext } from "@/app/contexts/FormContext";
import { PERIODS } from "@/constants/data";
import icons from "@/constants/icons";
import { router } from "expo-router";
import { Image, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import Dropdown from "../Dropdown";

export default function PricingForm() {
    
    const { formData, updateFormData, resetForm } = useFormContext();

    return (
        <ScrollView className="p-7 bg-white flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex flex-row justify-between items-center mb-2">
                <Text className="text-xl font-rubik-bold">Pricing & Terms</Text>

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

            <Text className="text-sm font-rubik text-black-100 mb-8">
                Set your price and agree to the listing terms.
            </Text>

            {/* Price Input */}
            <View className="mb-6">
                <Text className="text-sm font-rubik-medium text-black-300 mb-2">Price ($)</Text>
                <TextInput
                    value={formData.price}
                    onChangeText={(text) => updateFormData({ price: text })}
                    placeholder="e.g. 2500"
                    keyboardType="numeric"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300 font-rubik"
                />
            </View>

            {/* Payment Period Dropdown */}
            <View className="mb-8" style={{ zIndex: 1000 }}>
                <Text className="text-sm font-rubik-medium text-black-300 mb-2">Payment Period</Text>
                <Dropdown
                    placeholder="Select Period"
                    data={PERIODS}
                    value="Monthly"
                    onChange={(item) => updateFormData({ paymentPeriod: item.value })}
                />
            </View>

            {/* Terms and Conditions Switch */}
            <View className="flex-row items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <Switch
                    value={formData.terms}
                    onValueChange={(value) => updateFormData({ terms: value })}
                    trackColor={{ false: "#E2E8F0", true: "#0061FF" }}
                    thumbColor="white"
                />
                <Text className="ml-3 text-xs font-rubik text-black-200 flex-1">
                    I agree to the Property Listing Terms of Service and verify that all information provided is accurate.
                </Text>
            </View>
        </ScrollView>
    );
}