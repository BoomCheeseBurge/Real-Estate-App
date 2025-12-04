import { Tabs, useFocusEffect, usePathname } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

import icons from '@/constants/icons';
import { useGlobalContext } from '@/lib/global-provider';


/**
 * Custom Tab Icon Component to help fit the tab content properly
 */
const TabIcon = ({
    focused,
    icon,
    title,
}: {
    focused: boolean;
    icon: any;
    title: string;
}) => (
    <View className='flex-1 mt-3 flex flex-col items-center'>
        <Image source={icon} tintColor={focused ? '#0061ff' : '#666876'} resizeMode='contain' className='size-6'/>

        <Text className={`${focused ? 'text-primary-300 font-rubik-medium' : 'text-black-200 font-rubik'} text-xs w-full text-center mt-1`}>
            {title}
        </Text>
    </View>
)

const TabsLayout = () => {

    // Import the reset filter function
    const { resetAllFilters } = useGlobalContext();
    // Get the current page
    const pathname = usePathname();

    // Reset the filters when the user switch to any of these pages
    useFocusEffect(
        React.useCallback(() => {
            
            // Reset filters if the current pathname is any of the following
            if (pathname === '/profile' || pathname === 'test') {
                resetAllFilters();
            }

            return () => {
                // Optional cleanup function
            };
        }, [pathname])
    );

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    borderTopColor: '#0061FF1A',
                    borderTopWidth: 1,
                    minHeight: 70,
                }
            }}
        >
            {/* Home Tab */}
            <Tabs.Screen 
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.home} title="Home" />
                )
                }}
            />
            
            {/* Explore Tab */}
            <Tabs.Screen 
                name="explore"
                options={{
                    title: 'Explore',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.search} title="Explore" />
                )
                }}
            />

            {/* Profile Tab */}
            <Tabs.Screen 
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.person} title="Profile" />
                )
                }}
            />

            {/* Test Tab */}
            <Tabs.Screen 
                name="test"
                options={{
                    title: 'Test',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.info} title="Test" />
                )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout