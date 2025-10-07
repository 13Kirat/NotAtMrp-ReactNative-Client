import { View, Text, FlatList, ActivityIndicator, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { getEvents } from '../../api';
import { Event } from '../../types';
import EventCard from '../../components/EventCard';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';

const CATEGORIES = ['Comedy', 'Dance', 'Technology', 'Music', 'Food', 'Art', 'Sports', 'Business', 'Workshop', 'Food & Drink', 'Family', 'Wellness'];

export default function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const colorScheme = useColorScheme();

  const fetchEvents = async (pageNum = 1, category?: string) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      console.log('Fetching events with:', { pageNum, category });
      const data = await getEvents(pageNum, 10, category);
      console.log('Received data:', data);
      setEvents(prev => pageNum === 1 ? data.events : [...prev, ...data.events]);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch events.', error);
    } finally {
      if (pageNum === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEvents(1, selectedCategory);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEvents(nextPage, selectedCategory);
    }
  };

  const onCategoryPress = (category: string) => {
    setPage(1);
    setSelectedCategory(category === selectedCategory ? undefined : category);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : '#f3f4f6',
      paddingTop: 40,
    },
    searchContainer: {
      padding: 16,
      backgroundColor: colorScheme === 'dark' ? '#111827' : 'white',
    },
    textInput: {
      backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#e5e7eb',
      color: colorScheme === 'dark' ? 'white' : 'black',
      borderRadius: 9999,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#374151' : '#d1d5db',
    },
    categoriesScrollView: {
      marginTop: 16,
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 9999,
      marginRight: 8,
    },
    categoryButtonSelected: {
      backgroundColor: '#3b82f6',
    },
    categoryButtonUnselected: {
      backgroundColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
    },
    categoryText: {
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
    categoryTextSelected: {
      color: 'white',
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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Pressable onPress={() => router.push('/search')}>
          <TextInput
            placeholder="Search for events..."
            placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            style={styles.textInput}
            editable={false}
          />
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScrollView}>
          {CATEGORIES.map(cat => (
            <Pressable key={cat} onPress={() => onCategoryPress(cat)} style={[styles.categoryButton, selectedCategory === cat ? styles.categoryButtonSelected : styles.categoryButtonUnselected]}>
              <Text style={[styles.categoryText, selectedCategory === cat ? styles.categoryTextSelected : {}]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} style={styles.loader} />
      ) : (
        <FlatList
          data={events}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No events found.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
