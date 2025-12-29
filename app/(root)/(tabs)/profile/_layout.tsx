import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    // We use a Stack to allow navigation between index, reports, users, etc.
    <Stack screenOptions={{ headerShown: false }}>
      {/* Any screen added here will automatically inherit this stack behavior. */}
    </Stack>
  );
}