import { Tabs, useFocusEffect, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';

import icons from '@/constants/icons';
import { useAppwrite } from '@/hook/useAppwrite';
import { config, isUserInTeam } from '@/lib/appwrite';
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

/**
 * Prominent Tab Icon Component
 */
const TabIconProminent = ({
    focused,
    icon,
    title,
}: {
    focused: boolean;
    icon: any;
    title: string;
}) => (
    <View className='flex-1 mt-3 flex flex-col items-center'>
        
        <View 
            className={`
                w-12 h-12 rounded-full items-center justify-center bg-white shadow-lg border-2 ${focused ? 'border-[#0061FF]' : 'border-gray-300'} -translate-y-3
            `}
        >
            <Image 
                source={icon} 
                tintColor={focused ? '#0061FF' : '#666876'}
                resizeMode='contain' 
                className='size-6'
            />
        </View>
        
        {title ? (
            <Text className={`${focused ? 'text-primary-300 font-rubik-medium' : 'text-black-200 font-rubik'} text-xs w-full text-center mt-1`}>
                {title}
            </Text>
        ) : null}
        
    </View>
)

const TabsLayout = () => {

    // Import the reset filter function, currently user, and is logged-in
    const { resetAllFilters, user, isLoggedIn, setAdmin } = useGlobalContext();

    // Get the current page
    const pathname = usePathname();

    // Determine if this user is an admin
    const { data: isAdmin } = useAppwrite<boolean, { teamId: string }>({
        fn: isUserInTeam,
        params: { teamId: config.adminsTeamId },
        // Skip fetching until the user is logged in and the ID is available
        skip: !isLoggedIn || !user?.$id,
    });

    // Determine if this user is an agent
    const { data: isAgent } = useAppwrite<boolean, { teamId: string }>({
        fn: isUserInTeam,
        params: { teamId: config.agentsTeamId },
        // Fetch is skipped IF the user is NOT logged in OR the user IS an admin.
        skip: !isLoggedIn || isAdmin === true,
    });

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

    useEffect(() => {

        // Set global context for admin
        if (isAdmin) setAdmin(true);

    }, [isAdmin])
    

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

            {/* Upload New Property (for Admin or Agent) */}
            <Tabs.Screen 
                name="upload"
                options={{
                    title: 'upload',
                    headerShown: false,
                    href: (isAdmin || isAgent) ? '/upload' : null,
                    tabBarIcon: ({ focused }) => (
                    <TabIconProminent focused={focused} icon={icons.addProperty} title="" />
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

            {/* Dashboard Tab */}
            <Tabs.Screen 
                name="dashboard"
                options={{
                    href: (isAdmin || isAgent) ? "/dashboard" : null,
                    title: 'Dashboard',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.admin} title="Dashboard" />
                )
                }}
            />

            {/* Test Tab */}
            <Tabs.Screen 
                name="test"
                options={{
                    title: 'Test',
                    headerShown: false,
                    href: null,
                    tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.info} title="Test" />
                )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout