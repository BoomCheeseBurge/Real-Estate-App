import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';

interface PickerProps {
    value: string;
    onChange: (date: string) => void;
}

function Datetimepicker({ value, onChange }: PickerProps) {

    // Store the date value (current date as initial date)
    const [date, setDate] = useState(new Date);

    // Show the date time picker
    const [showPicker, setShowPicker] = useState(false);

    // Toggle the date time picker
    const togglePicker = () => {
        setShowPicker(!showPicker);
    };

    const formatDate = (rawDate: Date) => {
        let date = new Date(rawDate);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        return `${day}-${month}-${year}`;
    }

    // Update the parent component when date is changed
    const handleDateChange = ({type}: DateTimePickerEvent, selectedDate: Date | undefined) => {
        // Set date
        if (type == "set") {
            const currentDate = selectedDate;
            setDate(currentDate!);

            if (Platform.OS == "android") {
                // Hide picker
                togglePicker();

                // Set new value
                onChange(formatDate(currentDate!));
            }
        } else {
            // Hide picker
            togglePicker();
        }
    };

    return (
        <View>
            {showPicker && (
                <DateTimePicker 
                    mode="date"
                    display='spinner'
                    value={date}
                    onChange={handleDateChange}
                />
            )}

            {!showPicker && (
                <Pressable onPress={togglePicker}>
                    <TextInput
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-black-300"
                        placeholder="DD-MM-YYYY"
                        value={value}
                        editable={false}
                    />
                </Pressable>
            )}
        </View>
    );
}

export default Datetimepicker