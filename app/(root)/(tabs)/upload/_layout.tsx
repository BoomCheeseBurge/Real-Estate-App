import { FormProvider } from '@/app/contexts/FormContext';
import { UserLocationProvider } from '@/app/contexts/UserLocationContext';
import { Stack } from 'expo-router';

export default function UploadLayout() {
    return (
        <FormProvider>
            <UserLocationProvider>
                {/* We use a Stack to allow navigation between index, reports, users, etc. */}
                <Stack screenOptions={{ headerShown: false }} />
            </UserLocationProvider>
        </FormProvider>
    );
}