import icons from '@/constants/icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface RoomCountProps {
    name: string;
    minRoom: number;
    maxRoom: number;
    roomCount: number;
    setRoomCount: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const RoomCount = ({ name, minRoom, maxRoom, roomCount, setRoomCount }: RoomCountProps) => {

    // const [roomCount, setRoomCount] = useState(minRoom);

    // When decrement button is pressed
    const onRoomDecrease = () => {
        // We check the prop value (roomCount) against minRoom
        if (roomCount > minRoom) {
            
            // 🚨 FIX: Safely use the previous state value (prevCount), 
            // defaulting to minRoom if it's undefined (to ensure arithmetic starts from 1, not 0).
            setRoomCount(prevCount => (prevCount || minRoom) - 1);
        }
    };

    // When increment button is pressed
    const onRoomIncrease = () => {

        // We check the prop value (roomCount) against maxRoom
        if (roomCount < maxRoom) {

            // 🚨 FIX: Safely use the previous state value (prevCount), 
            // defaulting to minRoom if it's undefined (to ensure arithmetic starts from 1, not 0).
            setRoomCount(prevCount => (prevCount || minRoom) + 1);
        }
    };
   

    return (
        <View className='justify-between flex-row px-6 items-center'>
            <Text>{name}</Text>

            <View className='flex-row gap-x-4'>
                <TouchableOpacity 
                    onPress={onRoomDecrease}
                    disabled={roomCount === minRoom}
                    className={`rounded-full size-8 items-center justify-center ${
                        roomCount === minRoom ? 'bg-gray-300' : 'bg-primary-200'
                    }`}
                >
                    <Image source={icons.minusSign} className='rounded-3xl' />
                </TouchableOpacity>

                <Text className='justify-center items-center self-center'>{roomCount}</Text>

                <TouchableOpacity 
                    onPress={onRoomIncrease}
                    disabled={roomCount === maxRoom}
                    className={`rounded-full size-8 items-center justify-center ${
                        roomCount === maxRoom ? 'bg-slate-300' : 'bg-primary-200'
                    }`}
                >
                    <Image source={icons.plusSign} className='rounded-3xl' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default RoomCount;