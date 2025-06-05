import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { isValid, parseISO, format } from 'date-fns';
import { useLanguage } from '@/contexts/useLanguage';

export interface EventProps {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  imageUrl: string;
  attendees: number;
  price: number | 'Free';
}

const EventCard: React.FC<EventProps> = ({ 
  id, 
  title, 
  type, 
  date, 
  location, 
  imageUrl, 
  attendees, 
  price 
}) => {
  const { t } = useLanguage();

  // Helper function to safely format dates if needed
  const formatEventDate = (dateString: string) => {
    // If the date is already a formatted string like "June 15-18, 2025", return it as is
    if (!/^\d{4}-\d{2}-\d{2}/.test(dateString) && !dateString.includes('T')) {
      return dateString;
    }
    
    try {
      // For ISO string dates, try to parse them first
      const parsedDate = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      
      // Check if the date is valid before formatting
      if (isValid(parsedDate)) {
        return format(parsedDate, 'MMM dd, yyyy');
      }
      
      return dateString; // If invalid, just return the original string
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return dateString; // In case of error, return the original string
    }
  };

  return (
    <Link to={`/events/${id}`} className="group block h-full">
      <Card className="event-card overflow-hidden border border-gray-200 h-full transition-shadow hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" 
          />
          <Badge className="absolute top-4 right-4 bg-oceanBlue hover:bg-oceanBlue-dark">
            {type}
          </Badge>
        </div>
        <CardContent className="pt-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">{title}</h3>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Calendar className="h-4 w-4 mr-2 text-oceanBlue" />
            <span>{formatEventDate(date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-oceanBlue" />
            <span>{location}</span>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-gray-100 pt-4 flex justify-between">
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span>{attendees} {t('event.attending')}</span>
          </div>
          <div className="font-medium">
            {price === 'Free' ? (
              <span className="text-green-600">{t('event.free')}</span>
            ) : (
              <span>${price}</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
