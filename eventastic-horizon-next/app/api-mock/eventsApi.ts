// Mock API for events
import { allEvents } from './sampleEvents';
import { EventProps } from '../components/events/EventCard';
import { ExtendedEventProps } from './eventTypes';

// Lấy tất cả sự kiện
export async function getEvents(): Promise<EventProps[]> {
  return allEvents;
}

// Lấy chi tiết sự kiện theo id (trả về ExtendedEventProps)
export async function getEventById(id: string): Promise<ExtendedEventProps | undefined> {
  const foundEvent = allEvents.find(event => event.id === id);
  if (!foundEvent) return undefined;
  // Mock dữ liệu mở rộng
  return {
    ...foundEvent,
    description: "Join us for an amazing event that brings together experts and enthusiasts. This event will feature keynote presentations, interactive workshops, networking opportunities, and much more!",
    agenda: [
      {
        id: "1",
        time: "9:00 AM - 10:00 AM",
        title: "Registration and Welcome Coffee",
        description: "Check in and enjoy welcome refreshments",
        location: "Main Lobby"
      },
      {
        id: "2",
        time: "10:00 AM - 11:30 AM",
        title: "Keynote Presentation",
        description: "Opening keynote by industry leaders",
        speaker: "Jane Smith, CEO of TechCorp",
        location: "Grand Hall"
      },
      {
        id: "3",
        time: "11:45 AM - 12:45 PM",
        title: "Panel Discussion",
        description: "Experts discuss industry trends and innovations",
        speaker: "Multiple industry experts",
        location: "Conference Room A"
      },
      {
        id: "4",
        time: "1:00 PM - 2:00 PM",
        title: "Lunch Break",
        description: "Networking lunch with other attendees",
        location: "Dining Area"
      },
      {
        id: "5",
        time: "2:15 PM - 4:00 PM",
        title: "Workshop Sessions",
        description: "Interactive workshops on various topics",
        location: "Multiple Rooms"
      }
    ],
    exhibitionBooths: [
      {
        id: "1",
        name: "TechCorp Solutions",
        description: "Showcasing latest AI and ML technologies",
        location: "Booth A1"
      },
      {
        id: "2",
        name: "DataViz Inc.",
        description: "Data visualization tools and services",
        location: "Booth B3"
      },
      {
        id: "3",
        name: "CloudStack",
        description: "Cloud computing and infrastructure solutions",
        location: "Booth C2"
      }
    ],
    sponsors: [
      {
        id: "1",
        name: "TechGiant",
        logo: "/placeholder.svg",
        level: "platinum"
      },
      {
        id: "2",
        name: "InnovateNow",
        logo: "/placeholder.svg",
        level: "gold"
      },
      {
        id: "3",
        name: "FutureTech",
        logo: "/placeholder.svg",
        level: "silver"
      }
    ],
    isFree: foundEvent.price === 'Free',
    ticketTypes: foundEvent.price === 'Free' ? [] : [
      {
        id: "1",
        name: "General Admission",
        price: typeof foundEvent.price === 'number' ? foundEvent.price : 49.99,
        description: "Standard entry to the event",
        available: 100
      },
      {
        id: "2",
        name: "VIP Access",
        price: typeof foundEvent.price === 'number' ? foundEvent.price * 2 : 99.99,
        description: "Premium seating and exclusive networking",
        available: 30,
        isVIP: true
      },
      {
        id: "3",
        name: "Early Bird",
        price: typeof foundEvent.price === 'number' ? foundEvent.price * 0.8 : 39.99,
        description: "Discounted early registration",
        available: 50
      }
    ]
  };
}

// Lấy sự kiện theo loại (type)
export async function getEventsByType(type: string): Promise<EventProps[]> {
  return allEvents.filter(event => event.type === type);
}