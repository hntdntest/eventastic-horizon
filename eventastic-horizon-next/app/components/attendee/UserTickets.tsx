import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Ticket, Calendar, MapPin } from 'lucide-react';
import { allEvents } from '@/app/data/sampleEvents';
import { useLanguage } from '@/app/contexts/useLanguage';

interface TicketInfo {
  id: string;
  eventId: string;
  userId: string;
  type: string;
  price: number;
  purchaseDate: string;
  status: 'confirmed' | 'used' | 'canceled';
}

interface EventInfo {
  id: string;
  title: string;
  date: string;
  location: string;
  // Add other event fields as needed
}

interface EventTicketProps {
  ticket: TicketInfo;
  event: EventInfo | undefined;
}

const EventTicket: React.FC<EventTicketProps> = ({ ticket, event }) => {
  const { t } = useLanguage();
  return (
    <Card className="overflow-hidden">
      <div className="bg-oceanBlue p-4 text-white flex items-center justify-between">
        <h3 className="font-semibold">{event?.title || t('attendee.tickets.event')}</h3>
        <Badge variant="outline" className="text-white border-white">
          {ticket.status === 'confirmed' ? t('attendee.tickets.status.confirmed') : ticket.status === 'used' ? t('attendee.tickets.status.used') : t('attendee.tickets.status.canceled')}
        </Badge>
      </div>
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-2">
          <p className="font-medium">{ticket.type}</p>
          {event && (
            <>
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="h-4 w-4 mr-2 text-oceanBlue" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-2 text-oceanBlue" />
                <span>{event.location}</span>
              </div>
            </>
          )}
          <div className="text-sm text-gray-500 mt-2">
            <div>{t('attendee.tickets.ticketId')}: {ticket.id}</div>
            <div>{t('attendee.tickets.purchased')}: {new Date(ticket.purchaseDate).toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-100">
        <div className="flex w-full justify-between items-center">
          <div>
            {ticket.price === 0 ? (
              <span className="text-green-600 font-medium">{t('event.free')}</span>
            ) : (
              <span className="font-medium">${ticket.price.toFixed(2)}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              {t('attendee.tickets.viewDetails')}
            </Button>
            <Button variant="default" size="sm" className="bg-oceanBlue hover:bg-oceanBlue-dark">
              <Ticket className="mr-1 h-4 w-4" />
              {ticket.status === 'confirmed' ? t('attendee.tickets.showQr') : t('attendee.tickets.download')}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const UserTickets: React.FC = () => {
  const { t } = useLanguage();
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use localStorage
    const storedTickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    setTickets(storedTickets);
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 text-center">
          <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">{t('attendee.tickets.noTickets')}</h3>
          <p className="text-gray-500 mb-4">{t('attendee.tickets.noTicketsDesc')}</p>
          <Button
            className="bg-oceanBlue hover:bg-oceanBlue-dark"
            onClick={() => window.location.href = '/events'}
          >
            {t('attendee.tickets.browseEvents')}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('attendee.tickets.myTickets')}</h2>
      {tickets.map((ticket) => {
        const event = allEvents.find(e => e.id === ticket.eventId);
        return (
          <EventTicket 
            key={ticket.id} 
            ticket={ticket} 
            event={event} 
          />
        );
      })}
    </div>
  );
};

export default UserTickets;
