"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';
import { Button } from '@/app/components/ui/button';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { AspectRatio } from '@/app/components/ui/aspect-ratio';
import { toast } from '@/app/components/ui/use-toast';
import { getEventById } from '@/app/api-mock/eventsApi';
import { ExtendedEventProps, Sponsor, ExhibitionBooth, AgendaItem, TicketType } from '@/app/api-mock/eventTypes';

interface User {
  id: string;
  role?: string;
}

// Next.js page receives params as prop
const EventDetail = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const router = useRouter();
  const [event, setEvent] = useState<ExtendedEventProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      setUser(JSON.parse(userString));
    }
    getEventById(id).then(foundEvent => {
      setEvent(foundEvent || null);
      setLoading(false);
    });
  }, [id]);

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketType(ticketId);
  };

  const handleBuyTicket = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase tickets",
        variant: "destructive",
      });
      router.push(`/login?redirectAfterLogin=/events/${id}`);
      return;
    }

    if (!selectedTicketType && !event?.isFree) {
      toast({
        title: "Select a ticket",
        description: "Please select a ticket type to continue",
        variant: "destructive",
      });
      return;
    }

    // Mock ticket purchase
    const ticketId = `TICKET-${Math.floor(Math.random() * 10000)}`;
    const purchaseDate = new Date().toISOString();

    let ticketInfo;
    if (event?.isFree) {
      ticketInfo = {
        id: ticketId,
        eventId: id,
        userId: user.id || 'guest',
        type: 'Free Admission',
        price: 0,
        purchaseDate,
        status: 'confirmed'
      };
    } else {
      const selectedTicket = event?.ticketTypes.find(t => t.id === selectedTicketType);
      ticketInfo = {
        id: ticketId,
        eventId: id,
        userId: user.id || 'guest',
        type: selectedTicket?.name || 'General Admission',
        price: selectedTicket?.price || 0,
        purchaseDate,
        status: 'confirmed'
      };
    }

    const userTickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    userTickets.push(ticketInfo);
    localStorage.setItem('userTickets', JSON.stringify(userTickets));

    toast({
      title: "Success!",
      description: `Your ticket has been confirmed. Ticket ID: ${ticketId}`,
    });

    if (user.role) {
      router.push(`/${user.role}/dashboard`);
    } else {
      router.push('/select-role');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!event) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/events')}>Browse Events</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{event.title}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge className="bg-oceanBlue hover:bg-oceanBlue-dark">{event.type}</Badge>
                {event.isFree ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">Free Event</Badge>
                ) : (
                  <Badge variant="outline" className="text-oceanBlue border-oceanBlue">Ticketed Event</Badge>
                )}
              </div>
            </div>
            {/* Price & Date Section */}
            <div className="flex flex-col items-end">
              {!event.isFree && (
                <div className="text-lg md:text-xl font-semibold mb-2">
                  Starting from ${typeof event.price === 'number' ? event.price.toFixed(2) : '49.99'}
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-oceanBlue" />
                <span>{event.date}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover" 
            />
          </AspectRatio>
        </div>
        
        {/* Event Location & Attendees */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2 text-oceanBlue" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2 text-oceanBlue" />
            <span>{event.attendees} attending</span>
          </div>
        </div>
        
        {/* Event Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">About This Event</h2>
          <p className="text-gray-700">{event.description}</p>
        </div>
        
        {/* Tabs for Details */}
        <Tabs defaultValue="agenda" className="mb-8">
          <TabsList className="w-full grid grid-cols-3 md:grid-cols-4">
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="exhibition">Exhibition</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>
          
          {/* Agenda Tab */}
          <TabsContent value="agenda" className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Event Schedule</h3>
            <div className="space-y-6">
              {event.agenda.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="font-medium text-oceanBlue whitespace-nowrap">
                        {item.time}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{item.title}</h4>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        {item.speaker && <p className="text-sm">Speaker: {item.speaker}</p>}
                        {item.location && <p className="text-sm">Location: {item.location}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Exhibition Tab */}
          <TabsContent value="exhibition" className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Exhibition Booths</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.exhibitionBooths.map((booth) => (
                <Card key={booth.id}>
                  <CardContent className="p-4 md:p-6">
                    <h4 className="text-lg font-semibold mb-2">{booth.name}</h4>
                    <p className="text-gray-600 mb-2">{booth.description}</p>
                    <p className="text-sm text-gray-500">Location: {booth.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Sponsors Tab */}
          <TabsContent value="sponsors" className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Our Sponsors</h3>
            <div className="space-y-8">
              {['platinum', 'gold', 'silver', 'bronze'].map((level) => {
                const levelSponsors = event.sponsors.filter(s => s.level === level);
                if (levelSponsors.length === 0) return null;
                
                return (
                  <div key={level}>
                    <h4 className="text-lg font-medium mb-4 capitalize">{level} Sponsors</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {levelSponsors.map((sponsor) => (
                        <Card key={sponsor.id}>
                          <CardContent className="p-4 text-center">
                            <div className="w-24 h-24 mx-auto mb-2">
                              <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                            </div>
                            <p className="font-medium">{sponsor.name}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          {/* Tickets Tab */}
          <TabsContent value="tickets" className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Ticket Information</h3>
            {event.isFree ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">Free Admission</h4>
                      <p className="text-gray-600">This is a free event. Register to secure your spot!</p>
                    </div>
                    <div className="text-lg font-bold text-green-600">Free</div>
                  </div>
                  {user ? (
                    <Button 
                      className="mt-4 bg-oceanBlue hover:bg-oceanBlue-dark" 
                      onClick={handleBuyTicket}
                    >
                      <Ticket className="mr-2 h-4 w-4" />
                      Register Now
                    </Button>
                  ) : (
                    <Button 
                      className="mt-4 bg-oceanBlue hover:bg-oceanBlue-dark" 
                      onClick={() => router.push(`/login?redirectAfterLogin=/events/${id}`)}
                    >
                      <Ticket className="mr-2 h-4 w-4" />
                      Login to Register
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {event.ticketTypes.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className={`border ${selectedTicketType === ticket.id ? 'border-oceanBlue' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <h4 className="text-lg font-semibold">{ticket.name}</h4>
                            {ticket.isVIP && (
                              <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600">VIP</Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{ticket.description}</p>
                          <p className="text-sm text-gray-500 mt-1">{ticket.available} tickets available</p>
                        </div>
                        <div className="text-xl font-bold text-oceanBlue">${ticket.price.toFixed(2)}</div>
                      </div>
                      {user ? (
                        <Button 
                          variant={selectedTicketType === ticket.id ? "default" : "outline"} 
                          className={`mt-4 ${selectedTicketType === ticket.id ? 'bg-oceanBlue hover:bg-oceanBlue-dark' : 'text-oceanBlue border-oceanBlue'}`} 
                          onClick={() => handleTicketSelect(ticket.id)}
                        >
                          {selectedTicketType === ticket.id ? "Selected" : "Select"}
                        </Button>
                      ) : (
                        <Button 
                          variant="outline"
                          className="mt-4 text-oceanBlue border-oceanBlue"
                          onClick={() => router.push(`/login?redirectAfterLogin=/events/${id}`)}
                        >
                          Login to Select
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {user && selectedTicketType && (
                  <div className="mt-8 flex justify-end">
                    <Button 
                      size="lg" 
                      className="bg-oceanBlue hover:bg-oceanBlue-dark"
                      onClick={handleBuyTicket}
                    >
                      <Ticket className="mr-2 h-5 w-5" />
                      Purchase Ticket
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default EventDetail;
