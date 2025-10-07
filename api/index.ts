import axios from 'axios';
import { PaginatedEvents, Event } from '../types';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const getEvents = async (page = 1, limit = 5, category?: string): Promise<PaginatedEvents> => {
  // console.log('getEvents called with:', { page, limit, category });
  if (category) {
    const response = await searchEvents({ category });
    // console.log('searchEvents response in getEvents:', response);
    return {
      events: response.events,
      totalPages: 1, 
      currentPage: 1,
      totalEvents: response.events.length,
    };
  } else {
    const response = await apiClient.get('/events', {
      params: { page, limit },
    });
    // console.log('getEvents response:', response.data);
    return {
      events: response.data.data,
      ...response.data.pagination,
    };
  }
};

export const searchEvents = async (params: { 
  q?: string; 
  category?: string; 
  location?: string; 
  minPrice?: number; 
  maxPrice?: number; 
  page?: number;
  limit?: number;
}): Promise<PaginatedEvents> => {
  // console.log('searchEvents called with:', params);
  const response = await apiClient.get('/events/search', { params });
  // console.log('searchEvents response:', response.data);
  return {
    events: response.data.events,
    ...response.data.pagination,
  };
};

export const getEventById = async (id: string): Promise<Event> => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data.event;
};
