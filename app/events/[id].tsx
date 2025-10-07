import { View, Text, Image, ScrollView, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getEventById } from '../../api';
import { Event } from '../../types';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (id) {
      getEventById(id as string)
        .then(setEvent)
        .catch(() => console.error('Failed to fetch event details.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const styles = StyleSheet.create({
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notFoundContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notFoundText: {
      fontSize: 18,
      color: '#ef4444',
    },
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : '#f3f4f6',
    },
    image: {
      width: '100%',
      height: 240,
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
    category: {
      fontSize: 16,
      fontWeight: '600',
      color: '#3b82f6',
      marginTop: 4,
    },
    infoContainer: {
      marginTop: 16,
      backgroundColor: colorScheme === 'dark' ? '#1f2937' : 'white',
      borderRadius: 8,
      padding: 16,
    },
    description: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#d1d5db' : '#374151',
      marginTop: 16,
    },
    bookNowButton: {
      backgroundColor: '#2563eb',
      borderRadius: 9999,
      paddingVertical: 16,
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
    },
    bookNowText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  if (loading) {
    return <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} style={styles.loader} />;
  }

  if (!event) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Event not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event?.posterUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{event?.title}</Text>
        <Text style={styles.category}>{event?.category.toUpperCase()}</Text>

        <View style={styles.infoContainer}>
          <InfoRow icon="calendar-outline" label="Date" value={new Date(event?.date).toLocaleDateString()} />
          <InfoRow icon="time-outline" label="Time" value={event?.time} />
          <InfoRow icon="location-outline" label="Venue" value={`${event?.venue}, ${event?.location}`} />
          <InfoRow icon="mic-outline" label="Organizer" value={event?.organizer} />
          <InfoRow icon="cash-outline" label="Price" value={`$${event?.price}`} isBold={true} />
        </View>

        <Text style={styles.description}>{event?.description}</Text>

        <Pressable style={styles.bookNowButton}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const InfoRow = ({ icon, label, value, isBold }: { icon: keyof typeof Ionicons.glyphMap, label: string, value: string, isBold?: boolean }) => {
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      marginRight: 12,
    },
    label: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
    },
    value: {
      fontSize: 16,
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
    valueBold: {
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={20} color={colorScheme === 'dark' ? 'white' : 'black'} style={styles.icon} />
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, isBold ? styles.valueBold : {}]}>{value}</Text>
      </View>
    </View>
  );
};