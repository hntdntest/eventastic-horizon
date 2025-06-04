// Next.js version of EventAttendees migrated from Vite
'use client';
import React, { useEffect, useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { ArrowLeft, Users, Mail, Phone } from 'lucide-react';
import { allEvents } from '@/app/data/sampleEvents';
import { useLanguage } from '@/app/contexts/useLanguage';
import { useParams, useRouter } from 'next/navigation';

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;
  ticketType: string;
}

const EventAttendees: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const eventId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    // Find the event
    const foundEvent = allEvents.find((e: any) => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
      // Generate sample attendees data
      const sampleAttendees: Attendee[] = [
        {
          id: '1',
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          phone: '0123456789',
          registrationDate: '2024-05-15',
          ticketType: 'Standard'
        },
        {
          id: '2',
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          phone: '0987654321',
          registrationDate: '2024-05-16',
          ticketType: 'VIP'
        },
        {
          id: '3',
          name: 'Lê Hoàng C',
          email: 'lehoangc@email.com',
          registrationDate: '2024-05-17',
          ticketType: 'Standard'
        }
      ];
      setAttendees(sampleAttendees);
    }
  }, [eventId]);

  if (!event) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t('events.notFound') || 'Event not found'}</h1>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/organizer/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('analytics.backToDashboard') || 'Back to Dashboard'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {(t('organizer.attendeesFor')?.replace('{event}', event.title) || `Attendees for "${event.title}"`)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {t('organizer.totalAttendees') || 'Total Attendees'}: <span className="font-semibold">{attendees.length}</span>
              </div>
              <Button size="sm">
                {t('organizer.exportList') || 'Export List'}
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('organizer.attendeeName') || 'Name'}</TableHead>
                  <TableHead>{t('organizer.attendeeEmail') || 'Email'}</TableHead>
                  <TableHead>{t('organizer.attendeePhone') || 'Phone'}</TableHead>
                  <TableHead>{t('organizer.attendeeRegistrationDate') || 'Registration Date'}</TableHead>
                  <TableHead>{t('organizer.attendeeTicketType') || 'Ticket Type'}</TableHead>
                  <TableHead>{t('organizer.actions') || 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">{attendee.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {attendee.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {attendee.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {attendee.phone}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{attendee.registrationDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        attendee.ticketType === 'VIP' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {attendee.ticketType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        {t('organizer.contact') || 'Contact'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EventAttendees;
