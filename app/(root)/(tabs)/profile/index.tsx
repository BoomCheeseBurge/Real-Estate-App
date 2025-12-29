import { settings } from '@/constants/data';
import icons from '@/constants/icons';
import { logout } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ImageSourcePropType, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsItemProps {
    icon: ImageSourcePropType;
    title: string;
    onPress?: (path: string) => void;
    textStyle?: string;
    showArrow?: boolean;
}

/**
 * Reusable Component for Settings Item 
 */
const SettingsItem = ({ 
    icon, 
    title,
    onPress,
    textStyle,
    showArrow = true
}: SettingsItemProps) => (
    <TouchableOpacity onPress={onPress} className='flex flex-row items-center justify-between py-3'>
        <View className='flex flex-row items-center gap-3'>
            <Image source={icon} className='size-6'/>

            <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
                {title}
            </Text>
        </View>

        {/* Render Arrow */}
        {showArrow && <Image source={icons.rightArrow} className='size-5' />}
    </TouchableOpacity>
)

const Profile = () => {

    const { user, refetch } = useGlobalContext();

    // Initialize the router
    const router = useRouter(); 
    
    // Setting navigation handler
    const handleSettingNav = (path: string) => {

        router.push(path as any);
    };

    const handleLogout = async () => {

        const result = await logout();

        if (result) {
            Alert.alert('Success', 'You have been logged out successfully.');

            // Reevaluate the user state and navigate to the appropriate screen
            refetch();
        } else {
            Alert.alert('Error', 'An error occurred while logging out. Please try again.');
        }
    };

    return (
        <SafeAreaView className='h-full bg-white'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-32 px-7"
            >
                {/* Profile Header */}
                <View className='flex flex-row items-center justify-between mt-5'>
                    <Text className='text-xl font-rubik-bold'>
                        Profile
                    </Text>

                    <Image source={icons.bell} className='size-5'/>
                </View>

                {/* Profile Content */}
                <View className='flex-row justify-center flex mt-5'>
                    {/* AVATAR Section */}
                    <View className='flex flex-col items-center relative mt-5'>
                        {/* Avatar Image */}
                        <Image source={{ uri: user?.avatar }} className='size-44 relative rounded-full'/>

                        {/* Avatar Edit */}
                        <TouchableOpacity className='absolute bottom-11 right-2'>
                            <Image source={icons.edit} className='size-9'/>
                        </TouchableOpacity>

                        {/* Display Name */}
                        <Text className='text-2xl font-rubik-bold mt-2'>
                            {user?.name}
                        </Text>
                    </View>

                </View>

                {/* SETTINGS Section */}
                <View className='flex flex-col mt-10'>
                    {/* My Booking */}
                    <SettingsItem
                        icon={icons.calendar}
                        title="My Booking"
                    />

                    {/* Payments */}
                    <SettingsItem
                        icon={icons.wallet}
                        title="Payments"
                    />
                </View>

                {/* OTHER SETTINGS */}
                <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
                    {settings.slice(2).map((item, index) => (
                        <SettingsItem key={index} {...item} />
                    ))}

                    {/* BECOME AN AGENT BUTTON */}
                    <SettingsItem
                        icon={icons.agent}
                        title="Become an Agent"
                        onPress={() => {handleSettingNav("/profile/agentForm")}}
                    />
                </View>

                {/* LOGOUT BUTTON */}
                <View className='flex flex-col mt-10 border-t pt-5 border-primary-200'>
                    <SettingsItem
                        icon={icons.logout}
                        title="Logout"
                        textStyle="text-danger"
                        showArrow={false}
                        onPress={handleLogout}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Profile