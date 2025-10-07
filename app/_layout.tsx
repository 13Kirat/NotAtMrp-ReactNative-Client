import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{title: 'Search'}} />
        <Stack.Screen name="events/[id]" options={{ title: 'Event Details' }} />
      </Stack>
      
      <StatusBar style="auto" />
    </>
  );
}