
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, Mail, Phone } from 'lucide-react';
import { allEvents } from '../../data/sampleEvents';
import { useLanguage } from '@/contexts/useLanguage';

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;
  ticketType: string;
}

const EventAttendees: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    // Find the event
    const foundEvent = allEvents.find(e => e.id === eventId);
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
            <h1 className="text-2xl font-bold">Event not found</h1>
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
            onClick={() => navigate('/organizer/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Attendees for "{event.title}"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Total Attendees: <span className="font-semibold">{attendees.length}</span>
              </div>
              <Button size="sm">
                Export List
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Actions</TableHead>
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
                        Contact
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
