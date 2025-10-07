export interface Event {
  id: string;
  title: string;
  description: string;
  poster_image: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  organizer: string;
  available_seats: number;
  price: number;
}

export interface PaginatedEvents {
  events: Event[];
  totalPages: number;
  currentPage: number;
  totalEvents: number;
}
