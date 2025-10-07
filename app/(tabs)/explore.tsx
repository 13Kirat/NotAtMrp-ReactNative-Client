import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

// This screen acts as a redirect to the main search screen.
export default function SearchTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    router.replace('/search');
  }, [router]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
    </View>
  );
}
