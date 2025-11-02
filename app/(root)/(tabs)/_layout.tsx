import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

import icons from '@/constants/icons';


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
    </Tabs>
  )
}

export default TabsLayout