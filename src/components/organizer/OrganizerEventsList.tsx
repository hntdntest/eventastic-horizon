import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Edit, Settings } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { useLanguage } from '@/contexts/useLanguage';

interface OrganizerEventsListProps {
  events: {
    id: string;
    title: Record<string, string> | string;
    description?: Record<string, string> | string;
    category?: Record<string, string> | string;
    location?: Record<string, string> | string;
    startDate?: string;
    endDate?: string;
    imageUrl?: string;
  }[];
}

const OrganizerEventsList: React.FC<OrganizerEventsListProps> = ({ events }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Helper to get multilingual value with fallback
  const getMultilingualValue = (field: Record<string, string> | string | undefined, fallback = ''): string => {
    if (!field) return fallback;
    if (typeof field === 'string') return field;
    // Try selected language, then 'en', then first available
    return field[language] || field['en'] || Object.values(field)[0] || fallback;
  };

  // Helper function to safely format dates
  const formatEventDate = (dateString?: string) => {
    if (!dateString) return t('common.invalidDate');
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      if (isValid(date)) {
        return format(date, 'MMM dd, yyyy');
      }
      return t('common.invalidDate');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return t('common.invalidDate');
    }
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/organizer/events/${eventId}/edit`);
  };

  const handleViewAttendees = (eventId: string) => {
    navigate(`/organizer/events/${eventId}/attendees`);
  };

  const handleEventSettings = (eventId: string) => {
    navigate(`/organizer/events/${eventId}/settings`);
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const title = getMultilingualValue(event.title, t('organizer.event.noTitle'));
        const description = getMultilingualValue(event.description, '');
        const category = getMultilingualValue(event.category, '');
        const location = getMultilingualValue(event.location, '');
        // Use startDate/endDate for event duration
        const startDate = event.startDate ? formatEventDate(event.startDate) : '';
        const endDate = event.endDate ? formatEventDate(event.endDate) : '';
        const imageUrl = event.imageUrl || '/placeholder.svg';
        return (
          <Card key={event.id || index} className="overflow-hidden border-l-4 border-l-primary">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div 
                  className="w-full md:w-48 h-32 md:h-auto bg-cover bg-center" 
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="p-4 flex-grow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{title}</h3>
                    {description && (
                      <div className="text-gray-600 text-sm line-clamp-2">{description}</div>
                    )}
                    <div className="flex items-center text-gray-500 text-sm gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {startDate}
                        {endDate && startDate !== endDate ? ` - ${endDate}` : ''}
                      </span>
                    </div>
                    {location && (
                      <div className="flex items-center text-gray-500 text-sm gap-2">
                        <span className="font-semibold">{t('organizer.event.location')}:</span>
                        <span>{location}</span>
                      </div>
                    )}
                    {category && (
                      <div className="flex items-center text-gray-500 text-sm gap-2">
                        <span className="font-semibold">{t('organizer.event.category')}:</span>
                        <span>{category}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-500 text-sm gap-2">
                      <Users className="h-4 w-4" />
                      <span>{Math.floor(Math.random() * 200) + 50} {t('organizer.event.registered')}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex gap-1 hover:bg-primary hover:text-white"
                      onClick={() => handleEditEvent(event.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span>{t('common.edit')}</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex gap-1 hover:bg-primary hover:text-white"
                      onClick={() => handleViewAttendees(event.id)}
                    >
                      <Users className="h-4 w-4" />
                      <span>{t('organizer.event.attendees')}</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex gap-1 hover:bg-primary hover:text-white"
                      onClick={() => handleEventSettings(event.id)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>{t('organizer.event.settings')}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrganizerEventsList;
