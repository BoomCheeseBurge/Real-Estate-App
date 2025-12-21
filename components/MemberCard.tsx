import icons from "@/constants/icons"; // Assuming you have a triple-dot or settings icon
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Models } from "react-native-appwrite";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";


export default function MemberCard({ member, currentUserId }: { member: Models.Membership; currentUserId?: string; }) {

    const [isOpen, setIsOpen] = useState(false);

    const isSelf = currentUserId ? member.userId === currentUserId : false;

    const isAdmin = member.roles.includes('owner') || member.roles.includes('admin');
    const roleColor = isAdmin ? 'bg-indigo-500' : 'bg-gray-500';

    // Show actions dropdown
    const showActions = !isSelf && !isAdmin;

    // Animated style for the dropdown height and opacity
    const dropdownStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(isOpen ? 80 : 0), // Adjust height based on your button sizes
            opacity: withTiming(isOpen ? 1 : 0),
            overflow: 'hidden',
        };
    });

    return (
        <View className="my-2 mx-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Main Card Content */}
            <View className="flex-row items-center p-4">
                {/* Avatar */}
                <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mr-4">
                    <Text className="text-primary-600 font-rubik-bold text-lg">
                        {member.userName.charAt(0).toUpperCase()}
                    </Text>
                </View>

                {/* Info */}
                <View className="flex-1">
                    <Text className="text-base font-rubik-bold text-black-300" numberOfLines={1}>
                        {member.userName}
                    </Text>
                    <Text className="text-xs font-rubik text-black-100" numberOfLines={1}>
                        {member.userEmail || 'No Email Provided'}
                    </Text>
                </View>
                
                {/* Right Side: Role & Toggle */}
                <View className="items-end gap-y-2">
                    <View className={`px-3 py-1 rounded-lg ${roleColor} bg-opacity-10`}>
                        <Text className="text-[10px] font-rubik-bold uppercase tracking-wider">
                            {member.roles[0]}
                        </Text>
                    </View>
                    
                    {/* Toggle Button */}
                    {showActions ? (
                        <TouchableOpacity onPress={() => setIsOpen(!isOpen)} className="p-1">
                            <Image 
                                source={icons.caretDown}
                                className="size-4" 
                                style={{ 
                                    tintColor: '#666876', 
                                    transform: [{ rotate: isOpen ? '90deg' : '0deg' }] 
                                }} 
                            />
                        </TouchableOpacity>
                    ) : (
                        <View className="p-1 opacity-20">
                            <Image source={icons.lock} className="size-6" style={{ tintColor: '#666876' }} />
                        </View>
                    )}
                </View>
            </View>

            {/* Dropdown Options */}
            <Animated.View style={dropdownStyle} className="bg-slate-50 border-t border-slate-100">
                <View className="flex-row justify-around items-center h-full">
                    <TouchableOpacity 
                        className="flex-row items-center gap-x-2 px-6 py-2"
                        onPress={() => console.log("Edit", member.$id)}
                    >
                        <Image source={icons.edit} className="size-4" style={{ tintColor: '#0061FF' }} />
                        <Text className="text-primary-300 font-rubik-medium">Edit</Text>
                    </TouchableOpacity>

                    {/* Line Divider */}
                    <View className="w-[1px] h-6 bg-slate-200" />

                    <TouchableOpacity 
                        className="flex-row items-center gap-x-2 px-6 py-2"
                        onPress={() => console.log("Delete", member.$id)}
                    >
                        <Image source={icons.info} className="size-4" style={{ tintColor: '#EF4444' }} />
                        <Text className="text-red-500 font-rubik-medium">Delete</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};