import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { searchEvents } from '../api';
import { Event } from '../types';
import EventCard from '../components/EventCard';

import { useDebounce } from '../hooks/useDebounce';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const debouncedQuery = useDebounce(query, 500);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {
        q: debouncedQuery,
        location,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      };
      const data = await searchEvents(params);
      setResults(data.events);
    } catch (error) {
      console.error('Failed to search events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedQuery, location, minPrice, maxPrice]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : '#f3f4f6',
      padding: 16,
    },
    textInput: {
      backgroundColor: colorScheme === 'dark' ? '#1f2937' : 'white',
      color: colorScheme === 'dark' ? 'white' : 'black',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#374151' : '#d1d5db',
    },
    priceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    priceInput: {
      backgroundColor: colorScheme === 'dark' ? '#1f2937' : 'white',
      color: colorScheme === 'dark' ? 'white' : 'black',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#374151' : '#d1d5db',
      width: '48%',
    },
    loader: {
      marginTop: 32,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 80,
    },
    emptyText: {
      fontSize: 18,
      color: '#6b7280',
    },
  });

  return (<>
    <Stack.Screen options={{
      headerLeft: () => (
        <Pressable onPress={() => router.push("/(tabs)")}>
          <Ionicons name="arrow-back" size={24} style={{ marginRight: 16 }} />
        </Pressable>
      ),
    }} />
    <View style={styles.container}>
      <TextInput
        placeholder="Event name or keyword"
        value={query}
        onChangeText={setQuery}
        placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
        style={styles.textInput}
      />
      <View style={styles.priceContainer}>
        <TextInput
          placeholder="Min Price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          style={styles.priceInput}
        />
        <TextInput
          placeholder="Max Price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          style={styles.priceInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No results found.</Text>
            </View>
          )}
        />
      )}
    </View>
  </>
  );
}