
import { EventProps } from '../components/events/EventCard';

export const featuredEvents: EventProps[] = [
  {
    id: "ev1",
    title: "TechConf 2025: AI and the Future",
    type: "Technology",
    date: "June 15-18, 2025",
    location: "San Francisco, CA",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
    attendees: 1200,
    price: 299
  },
  {
    id: "ev2",
    title: "Summer Music Festival",
    type: "Music",
    date: "July 10-12, 2025",
    location: "Austin, TX",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80",
    attendees: 5000,
    price: 150
  },
  {
    id: "ev3",
    title: "Global Investment Summit",
    type: "Investment",
    date: "August 5, 2025",
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    attendees: 800,
    price: 499
  }
];

export const upcomingEvents: EventProps[] = [
  {
    id: "ev4",
    title: "Marathon for Charity",
    type: "Sports",
    date: "September 12, 2025",
    location: "Chicago, IL",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80",
    attendees: 3000,
    price: 'Free'
  },
  {
    id: "ev5",
    title: "Web Development Workshop",
    type: "Technology",
    date: "May 25, 2025",
    location: "Online",
    imageUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80",
    attendees: 500,
    price: 49
  },
  {
    id: "ev6",
    title: "Jazz Night Under the Stars",
    type: "Music",
    date: "June 8, 2025",
    location: "New Orleans, LA",
    imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80",
    attendees: 350,
    price: 75
  }
];

export const allEvents: EventProps[] = [
  ...featuredEvents,
  ...upcomingEvents,
  {
    id: "ev7",
    title: "Blockchain and Cryptocurrency Conference",
    type: "Technology",
    date: "July 22-23, 2025",
    location: "Miami, FL",
    imageUrl: "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80",
    attendees: 700,
    price: 249
  },
  {
    id: "ev8",
    title: "Regional Tennis Tournament",
    type: "Sports",
    date: "August 15-17, 2025",
    location: "Atlanta, GA",
    imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80",
    attendees: 200,
    price: 25
  },
  {
    id: "ev9",
    title: "Photography Masterclass",
    type: "Arts",
    date: "June 20, 2025",
    location: "Portland, OR",
    imageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80",
    attendees: 120,
    price: 149
  },
];
