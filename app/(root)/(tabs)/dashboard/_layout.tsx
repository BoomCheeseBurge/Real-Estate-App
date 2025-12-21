import { Stack } from 'expo-router';

// This component defines the navigation structure for all screens inside the /dashboard directory.
export default function DashboardLayout() {
  return (
    // We use a Stack to allow navigation between index, reports, users, etc.
    <Stack screenOptions={{ headerShown: false }}>
      {/* Any screen added here (like reports.tsx or users.tsx) 
          will automatically inherit this stack behavior. */}
    </Stack>
  );
}