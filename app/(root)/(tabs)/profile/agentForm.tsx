
import Dropdown from '@/components/Dropdown';
import { GENDER } from '@/constants/data';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AgentForm = () => {

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        companyAddress: "",
        gender: "",
        dob: new Date(),
        agreed: false,
    });

    const [loading, setLoading] = useState(false);

    const [showPicker, setShowPicker] = useState(false);

    const handleSubmit = async () => {
        // User needs to agree to ToS
        if (!form.agreed) {
            Alert.alert("ℹ️ Info", "Please agree to the terms and services.");
            return;
        }

        try {
            // show loading spinner
            setLoading(true);
            
            // Sanitize the form
            // Remove accidental leading/trailing spaces from user input
            const sanitizedData = {
                fullName: form.fullName.trim(),
                email: form.email.trim().toLowerCase(), // Lowercase email for consistency
                phone: form.phone.trim(),
                company: form.company.trim(),
                companyAddress: form.companyAddress.trim(),
                gender: form.gender,
                dob: form.dob,
                agreed: form.agreed
            };
    
            // Check if required fields are empty
            if (!sanitizedData.fullName || !sanitizedData.email || !sanitizedData.phone) {
                Alert.alert("Error", "Please fill in all required fields.");
                return;
            }
    
            // Email Validation
            const emailRegex = /\S+@\S+\.\S+/;
    
            if (!emailRegex.test(sanitizedData.email)) {
                Alert.alert("Error", "Please enter a valid email address.");
                return;
            }
    
            // Store to db (but for now just log to console)
            console.log("Form Submitted:", form);
            Alert.alert("Success", "Your application has been submitted!");
    
            router.back();

        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text className="text-2xl font-rubik-bold text-black-300 mb-2">
                        Become a Property Agent
                    </Text>
                    
                    <Text className="text-base font-rubik text-black-100 mb-8">
                        Please fill in the details below to apply.
                    </Text>

                    {/* Full Name */}
                    <View className="mb-5">
                        <Text className="text-sm font-rubik-medium text-black-300 mb-2">Full Name</Text>

                        <TextInput
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300"
                            editable={!loading}
                            placeholder="Enter full name"
                            value={form.fullName}
                            onChangeText={(text) => setForm({ ...form, fullName: text })}
                        />
                    </View>

                    {/* Email */}
                    <View className="mb-5">
                        <Text className="text-sm font-rubik-medium text-black-300 mb-2">Email Address</Text>

                        <TextInput
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300"
                            editable={!loading}
                            placeholder="mail@domain.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
                        />
                    </View>

                    {/* Phone Number */}
                    <View className="mb-5">
                        <Text className="text-sm font-rubik-medium text-black-300 mb-2">Phone Number</Text>

                        <TextInput
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300"
                            editable={!loading}
                            placeholder="+1 234 567 890"
                            keyboardType="phone-pad"
                            value={form.phone}
                            onChangeText={(text) => setForm({ ...form, phone: text })}
                        />
                    </View>

                    {/* Company & Address */}
                    <View className="flex-row gap-x-4 mb-5">
                        <View className="flex-1">
                            <Text className="text-sm font-rubik-medium text-black-300 mb-2">Company</Text>
                            <TextInput
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300"
                            editable={!loading}
                            placeholder="Real Estate Co."
                            value={form.company}
                            onChangeText={(text) => setForm({ ...form, company: text })}
                            />
                        </View>
                    </View>

                    <View className="mb-5">
                        <Text className="text-sm font-rubik-medium text-black-300 mb-2">Company Address</Text>

                        <TextInput
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300"
                            editable={!loading}
                            placeholder="123 Business Ave, Suite 100"
                            multiline
                            value={form.companyAddress}
                            onChangeText={(text) => setForm({ ...form, companyAddress: text })}
                        />
                    </View>

                    {/* Gender & DoB */}
                    <View className="mb-5 gap-y-5">
                        <View>
                            <Text className="text-sm font-rubik-medium text-black-300 mb-2">Gender</Text>

                            <Dropdown 
                                disabled={loading}
                                placeholder='Select gender' 
                                data={GENDER} 
                                onChange={(item) => setForm({...form, gender: item.value})} 
                            />
                        </View>

                        <View className="flex-1">
                            <Text className="text-sm font-rubik-medium text-black-300 mb-2">Birthday</Text>
                            
                            <TouchableOpacity 
                                onPress={() => setShowPicker(true)}
                                disabled={loading}
                                className={`bg-slate-50 border border-slate-200 rounded-xl p-4 flex-row justify-between ${loading ? 'opacity-50' : ''}`}
                            >
                                <Text className="text-black-300">
                                    {form.dob ? form.dob.toLocaleDateString() : "Select Date"}
                                </Text>
                            </TouchableOpacity>

                            {showPicker && (
                                <RNDateTimePicker 
                                    value={form.dob} 
                                    mode="date"
                                    display="default" 
                                    maximumDate={new Date()} 
                                    onChange={(event, selectedDate) => {
                                        // picker must be hidden manually after selection on Android 
                                        setShowPicker(false); 
                                        
                                        if (event.type === "set" && selectedDate) {
                                            setForm({ ...form, dob: selectedDate });
                                        }
                                    }}                             
                                />
                            )}
                        </View>
                    </View>

                    {/* Terms Agreement */}
                    <View className="flex-row items-center mb-3">
                        <Switch
                            value={form.agreed}
                            onValueChange={(value) => setForm({ ...form, agreed: value })}
                            trackColor={{ false: "#E2E8F0", true: "#0061FF" }}
                        />
                        <Text className="ml-3 text-sm font-rubik text-black-200 flex-1">
                            I agree to the Terms of Service and Privacy Policy.
                        </Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity 
                        onPress={handleSubmit}
                        disabled={loading}
                        className={`${loading ? 'bg-primary-500' : 'bg-primary-300'} p-4 rounded-2xl shadow-md items-center mb-16`}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" /> 
                        ): (
                            <Text className="text-white font-rubik-bold text-lg">Submit Application</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
        </SafeAreaView>
    )
}

export default AgentForm;