import icons from "@/constants/icons";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyModal from "./MyModal";

export default function ProfilePicture({ user, refetch }: { user: any, refetch: () => void }) {

    const [modalVisible, setModalVisible] = useState(false);

    const [image, setImage] = useState(user.prefs.profilePicture ?? user?.avatar);

    // Handle image picking from gallery
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library.
        // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
        // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
        // so the app users aren't surprised by a system dialog after picking a video.
        // See "Invoke permissions for videos" sub section for more details.
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: false,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {

            console.log('Profile Picture Uploaded');

            // Upload profile picture to AppWrite
            // const url = await uploadProfilePic(result.assets[0]);
            
            // Set the image URL for the displayed profile picture
            // setImage(url);

            setModalVisible(false);
        }
    };

    // Handle image picking from camera
    const pickCamera = async () => {

        try {
            // Asks the user to grant permissions for accessing camera
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
            if (!permissionResult.granted) {
                Alert.alert('Permission required', 'Permission to access the camera is required.');
                return;
            }
    
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                aspect: [1, 1],
                quality: 1,
                cameraType: ImagePicker.CameraType.front,
                allowsEditing: true,
            });
    
            if (!result.canceled) {
    
                console.log('Profile Picture Uploaded');

                // Upload profile picture to AppWrite
                // const url = await uploadProfilePic(result.assets[0]);
                
                // Set the image URL for the displayed profile picture
                // setImage(url);
                    
                setModalVisible(false);
            }
            
        } catch (error) {
            console.log('Pick Camera Error:', error);
            setModalVisible(false);
        }
    };

    const uploadProfilePic = async (image: ImagePicker.ImagePickerAsset) => {

        try {
            // await setProfilePicture(image);
            setModalVisible(false);
            
        } catch (error) {
            console.log('Upload Profile Picture Error:', error);            
            Alert.alert('Error', 'An error occurred while uploading the profile picture. Please try again.');
        }
    };

    // Remove image from selected images
    const removeImage = async () => {
        console.log('Profile Picture Removed');
        // await removeProfilePicture();

        setModalVisible(false);
    };

    return (
        <View className='flex-row justify-center flex mt-5'>
            {/* AVATAR Section */}
            <View className='flex flex-col items-center relative mt-5'>
                {/* Avatar Image */}
                <Image source={{ uri: image }} className='size-44 relative rounded-full'/>

                {/* Avatar Edit */}
                <TouchableOpacity 
                    className='absolute bottom-11 right-2'
                    onPress={() => setModalVisible(true)}
                >
                    <Image source={icons.edit} className='size-9'/>
                </TouchableOpacity>

                {/* Display Name */}
                <Text className='text-2xl font-rubik-bold mt-2'>
                    {user?.name}
                </Text>
                
                <MyModal visible={modalVisible} onClose={setModalVisible} title="Choose an action">
                
                    <View className='flex-1'>
                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                        >
                            <View className='flex-row gap-x-8 justify-center items-center'>
                                {/* Options to select images */}
                                <View>
                                    <TouchableOpacity 
                                        onPress={pickCamera}
                                        className='self-center gap-y-1'
                                    >
                                        <Image source={icons.camera} className='size-16' />

                                        <Text className='text-center text-black font-rubik-medium'>Camera</Text>
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <TouchableOpacity 
                                        onPress={pickImage}
                                        className='self-center gap-y-1'
                                    >
                                        <Image source={icons.gallery} className='size-16' />

                                        <Text className='text-center text-black font-rubik-medium'>Gallery</Text>
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <TouchableOpacity 
                                        onPress={removeImage}
                                        className='self-center gap-y-1'
                                    >
                                        <Image source={icons.trash} className='size-16' />

                                        <Text className='text-center text-black font-rubik-medium'>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </MyModal>
            </View>
        </View>
    );
}