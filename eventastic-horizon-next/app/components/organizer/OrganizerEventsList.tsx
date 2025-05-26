import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from "@/app/components/ui/button";
import { EventProps } from '../events/EventCard';
import { Calendar, Users, Edit, Settings } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { useLanguage } from '@/app/contexts/useLanguage';

interface OrganizerEventsListProps {
  events: EventProps[];
}

const OrganizerEventsList: React.FC<OrganizerEventsListProps> = ({ events }) => {
  const { t } = useLanguage();

  // Helper function to safely format dates
  const formatEventDate = (dateString: string) => {
    try {
      // For string dates, try to parse them first
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      
      // Check if the date is valid before formatting
      if (isValid(date)) {
        return format(date, 'MMM dd, yyyy');
      }
      return t('common.invalidDate');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return t('common.invalidDate');
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <Card key={index} className="overflow-hidden border-l-4 border-l-primary">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div 
                className="w-full md:w-48 h-32 md:h-auto bg-cover bg-center" 
                style={{ backgroundImage: `url(${event.imageUrl})` }}
              />
              <div className="p-4 flex-grow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm gap-2">
                    <Users className="h-4 w-4" />
                    <span>{Math.floor(Math.random() * 200) + 50} registered</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  <Button size="sm" variant="outline" className="flex gap-1 hover:bg-primary hover:text-white">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button size="sm" variant="outline" className="flex gap-1 hover:bg-primary hover:text-white">
                    <Users className="h-4 w-4" />
                    <span>Attendees</span>
                  </Button>
                  <Button size="sm" variant="outline" className="flex gap-1 hover:bg-primary hover:text-white">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrganizerEventsList;
