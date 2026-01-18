import { useFormContext } from "@/app/contexts/FormContext";
import { useUserLocationContext } from "@/app/contexts/UserLocationContext";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function GoogleMapsView() {

    const { updateFormData } = useFormContext();
    const { location } = useUserLocationContext();
    const DEFAULT_DELTA = 0.015; // Neighborhood level zoom
    // const mapRef = useRef<MapView>(null);

    const [pinpointLocation, setPinpointLocation] = useState({
        latitude: location?.coords.latitude || 37.78825,
        longitude: location?.coords.longitude || -122.4324,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA,
    });

    // const centerOnLocation = (lat: number, lng: number) => {
    //     mapRef.current?.animateToRegion({
    //         latitude: lat,
    //         longitude: lng,
    //         latitudeDelta: DEFAULT_DELTA,
    //         longitudeDelta: DEFAULT_DELTA,
    //     }, 1000); // duration set for a smooth glide
    // };

    const handleMapPress = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        
        setPinpointLocation((prev) => ({
            ...prev,
            latitude,
            longitude,
        }));
    };

    // Listen for context location changes
    useEffect(() => {
        if (location?.coords) {
            setPinpointLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: DEFAULT_DELTA,
                longitudeDelta: DEFAULT_DELTA,
            });
        }
    }, [location]);

    // Sync the local map state with the Form Context
    useEffect(() => {
        updateFormData({
            latitude: pinpointLocation.latitude,
            longitude: pinpointLocation.longitude
        });

    }, [pinpointLocation]);

    return (
        <View className="rounded-2xl overflow-hidden">
            <MapView
                style={{ 
                    width: Dimensions.get('screen').width * 0.9, 
                    height: Dimensions.get('screen').height * 0.3
                }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                region={pinpointLocation}
                onPress={handleMapPress}
            >
                <Marker
                    title="You"
                    coordinate={pinpointLocation}
                />
            </MapView>
        </View>
    );
}