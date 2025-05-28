
export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  level: 'platinum' | 'gold' | 'silver' | 'bronze';
}

export interface ExhibitionBooth {
  id: string;
  name: string;
  description: string;
  location: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  location?: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
  isVIP?: boolean;
}

import { EventProps } from '@/app/components/events/EventCard';
export interface ExtendedEventProps extends EventProps {
  description: string;
  agenda: AgendaItem[];
  exhibitionBooths: ExhibitionBooth[];
  sponsors: Sponsor[];
  ticketTypes: TicketType[];
  isFree: boolean;
}
