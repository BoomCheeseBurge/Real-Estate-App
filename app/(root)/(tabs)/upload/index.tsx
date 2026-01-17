import { useFormContext } from "@/app/contexts/FormContext";
import FacilitiesForm from "@/components/multiStepForm/FacilitiesForm";
import OverviewForm from "@/components/multiStepForm/OverviewForm";
import PricingForm from "@/components/multiStepForm/PricingForm";
import PropertyForm from "@/components/multiStepForm/PropertyForm";
import WavyText from "@/components/WavyText";
import { insertNewProperty } from "@/lib/appwrite";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Upload() {

    const { page, nextPage, prevPage, formData, resetForm } = useFormContext();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validate form fields before proceeding to the next form step
    const validateStep = () => {

        switch (page) {
            case 1: // PropertyForm
                if (!formData.propertyName.trim()) return "Property Name is required.";
                if (formData.images.length === 0) return "Please upload at least one image.";
                if (!formData.propertyType) return "Please select a property type.";
                if (!formData.beds || !formData.bathrooms || !formData.areaSize) return "Beds, Baths, and Area Size are required.";
                break;
            case 2: // OverviewForm
                if (!formData.description.trim() || formData.description.length < 20) {
                    return "Please provide an overview (at least 20 characters).";
                }
                break;
            case 3: // FacilitiesForm
                if (formData.facilities.length === 0) return "Please select at least one facility.";
                break;
            case 4: // PricingForm
                if (!formData.price) return "Please set a price.";
                if (!formData.terms) return "You must agree to the terms and conditions.";
                break;
            default:
                return null;
        }
        return null;
    };

    // Handle next form step button
    const handleNext = () => {
        const errorMessage = validateStep();

        if (errorMessage) {
            Alert.alert("Please fill in missing information", errorMessage);
            return;
        }

        nextPage();
    };

    const handleSubmit = async () => {

        const errorMessage = validateStep();

        if (errorMessage) {
            Alert.alert("Missing Information", errorMessage);
            return;
        }

        Alert.alert(
            "Confirm Upload",
            "Are you sure you want to upload this property?",
        [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Submit",
                onPress: async () => {
                    try {
                        // Loading state
                        setIsSubmitting(true);

                        // Insert new property record into AppWrite database
                        // const {
                        //     data: insertResult,
                        //     loading
                        // } = useAppwrite<Models.DefaultRow, FormData>({
                        //     fn: insertNewProperty,
                        //     params: formData,
                        //     skip: true
                        // });

                        const insertResult = await insertNewProperty(formData);

                        if (insertResult && !isSubmitting) {
                            Alert.alert("Success", `${insertResult.name} successfully uploaded!`, [
                                { text: "OK", onPress: () => {
                                    resetForm(); // Clear form
                                    router.replace('/'); // Redirect to the home screen 
                                }}
                            ]);
                        }
                    } catch (e) {
                        console.log("Error uploading property:", e);
                        Alert.alert("Error", "Property upload failed. Try again.");

                    } finally {
                        setIsSubmitting(false);
                    }
                }
            }
        ]);
    };

    return (
        // flex-1 is required here so the safe area stretches to the whole screen
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>

            {/* Show loading when submitting form */}
            {isSubmitting && (
                // Loading wrapper
                <View className="absolute z-10 bg-slate-100/50 h-full w-full" pointerEvents={isSubmitting ? 'none' : 'auto'}>
                    {/* Loading overlay */}
                    <View className="justify-center items-center top-1/2 left-0 right-0 gap-y-4">
                        <ActivityIndicator size={"large"} color={"blue"} />
                        
                        <WavyText text="Uploading Property..." />
                    </View>
                </View>
            )}

            {/* Conditional Form Rendering */}
            {page === 1 ? <PropertyForm /> : page === 2 ? <OverviewForm /> : page === 3 ? <FacilitiesForm /> : <PricingForm />}

            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 pt-4 pb-8 flex-row gap-4">
                {/* Back Button */}
                {page > 1 && (
                    <TouchableOpacity
                        onPress={prevPage}
                        disabled={isSubmitting}
                        className="flex-1 border border-slate-200 py-4 rounded-2xl items-center justify-center"
                    >
                        <Text className="text-slate-500 font-rubik-medium">Previous</Text>
                    </TouchableOpacity>
                )}

                {/* Next/Submit Button */}
                <TouchableOpacity
                    onPress={page === 4 ? handleSubmit : handleNext}
                    disabled={isSubmitting}
                    className="flex-[2] bg-primary-300 py-4 rounded-2xl items-center justify-center shadow-lg shadow-primary-200"
                >
                    <Text className="text-white font-rubik-bold text-lg">
                        {page === 4 ? "Get Started" : "Continue"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}