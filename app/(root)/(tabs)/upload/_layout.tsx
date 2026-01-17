import { FormProvider } from '@/app/contexts/FormContext';
import { Stack } from 'expo-router';

export default function UploadLayout() {
  return (
    <FormProvider>
        {/* We use a Stack to allow navigation between index, reports, users, etc. */}
        <Stack screenOptions={{ headerShown: false }} />
    </FormProvider>
  );
}