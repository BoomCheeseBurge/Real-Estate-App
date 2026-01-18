import * as Location from 'expo-location';
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Alert } from 'react-native';

// Define a Place from the Google API
// interface GooglePlace {
//   displayName: { text: string };
//   formattedAddress: string;
//   location: {
//     latitude: number;
//     longitude: number;
//   };
// }

interface UserLocationContextType {
  location: Location.LocationObject | null;
  setLocation: Dispatch<SetStateAction<Location.LocationObject | null>>;
  errorMsg: string | null;
  searchPlaceByQuery: (query: string) => void;
//   searchPlaceByQuery: (query: string) => Promise<GooglePlace[]>;
}

const UserLocationContext = createContext<UserLocationContextType | null>(null);

export const UserLocationProvider = ({ children }: { children: React.ReactNode }) => {

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // This is for using Places API (New) the next-gen version
    // const searchPlaceByQuery = async (query: string) => {
    //     try {
    //         const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    //                 // Crucial: define exactly what response data to be sent back
    //                 'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location',
    //             },
    //             body: JSON.stringify({
    //                 textQuery: query,
    //                 maxResultCount: 1, // Optional: limits the number of results
    //             }),
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.error?.message || 'Failed to fetch places');
    //         }

    //         const result = await response.json();
    //         setLocation({
    //             coords: {
    //                 latitude: result.places?.[0]?.location?.latitude,
    //                 longitude: result.places?.[0]?.location?.longitude,
    //                 altitude: null,
    //                 accuracy: null,
    //                 altitudeAccuracy: null,
    //                 heading: null,
    //                 speed: null,
    //             },
    //             timestamp: Date.now()
    //         });

    //         return;

    //     } catch (error) {
    //         console.error("Search Error:", error);
    //         Alert.alert("Search Error", "Could not find location. Please check your connection.");
    //         return [];
    //     }
    // };

    // Legacy version free to use
    const searchPlaceByQuery = async (query: string) => {
        try {
            // Encode the query to handle spaces and special characters
            const encodedQuery = encodeURIComponent(query);
            const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

            // Legacy API uses GET with query parameters
            const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address,name,geometry&input=${encodedQuery}&inputtype=textquery&key=${apiKey}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch from Legacy Places API');
            }

            const result = await response.json();

            if (result.status === "OK" && result.candidates && result.candidates.length > 0) {
                const topResult = result.candidates[0];

                // Map the Legacy "geometry.location" to your Expo state structure
                setLocation({
                    coords: {
                        latitude: topResult.geometry.location.lat,
                        longitude: topResult.geometry.location.lng,
                        altitude: null,
                        accuracy: null,
                        altitudeAccuracy: null,
                        heading: null,
                        speed: null,
                    },
                    timestamp: Date.now()
                } as Location.LocationObject);

                // console.log("Legacy Search Result:", topResult);
            } else if (result.status === "ZERO_RESULTS") {
                Alert.alert("No Results", "Could not find that location.");
            } else {
                throw new Error(result.error_message || "API Error");
            }

        } catch (error) {
            console.error("Legacy Search Error:", error);
            Alert.alert("Search Error", "An error occurred while searching.");
        }
    };

    useEffect(() => {
        async function getCurrentLocation() {    
            let { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    return (
        <UserLocationContext.Provider value={{ location, setLocation, errorMsg, searchPlaceByQuery }}>
            {children}
        </UserLocationContext.Provider>
    );
}

// Context access helper
export const useUserLocationContext = () => {

    const context = useContext(UserLocationContext);

    if (!context) throw new Error("useUserLocationContext must be used within a UserLocationProvider");

    return context;
};