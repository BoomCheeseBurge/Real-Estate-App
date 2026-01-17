import { useFormContext } from '@/app/contexts/FormContext';
import icons from '@/constants/icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MyModal from './MyModal';

export default function ImagePickerButton() {

    const { formData, updateFormData } = useFormContext();

    const [modalVisible, setModalVisible] = useState(false);

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
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {

            // Update form from context
            updateFormData({ 
                images: [...formData.images, ...result.assets] 
            });
            
            setModalVisible(false);
        }
    };

    // Handle image picking from camera
    const pickCamera = async () => {

        // Asks the user to grant permissions for accessing camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the camera is required.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {

            // Update form from context
            updateFormData({ 
                images: [...formData.images, ...result.assets] 
            });
            
            setModalVisible(false);
        }
    };

    // Remove image from selected images
    const removeImage = (item: ImagePicker.ImagePickerAsset) => {
        updateFormData({
            images: formData.images.filter(img => img.uri !== item.uri)
        });
    };

    return (
        <View className='w-full justify-center items-center mt-2'>

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
                        </View>
                    </ScrollView>
                </View>
            </MyModal>
            
            {/* No images selected */}
            {formData.images.length === 0 && ( 
                <TouchableOpacity 
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.7}
                    className="w-full h-40 bg-zinc-50 rounded-2xl items-center justify-center border-dashed border-2 border-slate-200"
                >
                    <View className="items-center justify-center gap-y-2">
                        <Image source={icons.plusIcon} className='size-10 opacity-50' /> 
                        <Text className="text-black-200 font-rubik-medium text-base">Add Image</Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Images selected */}
            {formData.images.length > 0 && (
                <View className="w-full">
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 10 }}
                    >
                        {formData.images.map((item, index) => (
                            <View key={index} className="mr-4 w-40 h-40 relative">
                                <Image 
                                    source={{ uri: item.uri }} 
                                    className="w-full h-full rounded-xl" 
                                />
                                <TouchableOpacity 
                                    className="absolute top-2 right-2 bg-white rounded-full py-1 px-2.5 shadow-sm"
                                    onPress={() => removeImage(item)}
                                >
                                    <Text className="text-primary-300 text-base font-bold">X</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* "Add More" Button as the last item in the map */}
                        <TouchableOpacity 
                            onPress={() => setModalVisible(true)}
                            className="w-40 h-40 border-2 border-dashed border-slate-300 rounded-2xl items-center justify-center bg-zinc-50"
                        >
                            <View className="items-center gap-y-1.5">
                                <Image source={icons.plusIcon} className='size-5 opacity-50' />
                                <Text className="text-slate-500 font-rubik-medium text-xs">Add More</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}
