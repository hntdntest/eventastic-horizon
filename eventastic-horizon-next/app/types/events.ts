export interface EventProps {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  imageUrl: string;
  price: number | 'Free';
  attendees: number;
}