import { View, Text, Image, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: 'hidden',
      margin: 8,
    },
    image: {
      width: '100%',
      height: 160,
    },
    content: {
      padding: 16,
    },
    category: {
      fontSize: 12,
      color: '#3b82f6',
      fontWeight: '600',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      marginTop: 4,
    },
    date: {
      fontSize: 14,
      color: '#4b5563',
      marginTop: 4,
    },
    location: {
      fontSize: 14,
      color: '#4b5563',
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#16a34a',
      marginTop: 8,
    },
  });

  return (
    <Link href={`/events/${event.id}`} asChild>
      <Pressable style={styles.card}>
        <Image source={{ uri: event.posterUrl }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.category}>{event.category.toUpperCase()}</Text>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.date}>{new Date(event.date).toLocaleDateString()}</Text>
          <Text style={styles.location}>{event.location}</Text>
          <Text style={styles.price}>${event.price}</Text>
        </View>
      </Pressable>
    </Link>
  );
}