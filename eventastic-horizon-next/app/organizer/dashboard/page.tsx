'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Calendar, BarChart2, Users, Settings, PieChart } from 'lucide-react';
import { EventProps } from '@/app/components/events/EventCard';
import EventList from '@/app/components/events/EventList';
import { allEvents } from '@/app/data/sampleEvents';
import { Separator } from '@/app/components/ui/separator';
import OrganizerEventsList from '@/app/components/organizer/OrganizerEventsList';
import EventStatsCard from '@/app/components/organizer/EventStatsCard';
import { useLanguage } from '@/app/contexts/useLanguage';
import MainLayout from '@/app/components/layout/MainLayout';

interface User {
  email: string;
  role: string;
}

const OrganizerNavigation: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-white shadow-sm border-b mb-6">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">{t('organizer.tabs.dashboard')}</TabsTrigger>
            <TabsTrigger value="events">{t('organizer.tabs.myEvents')}</TabsTrigger>
            <TabsTrigger value="tickets">{t('organizer.tabs.tickets')}</TabsTrigger>
            <TabsTrigger value="sponsors">{t('organizer.tabs.sponsors')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('organizer.tabs.analytics')}</TabsTrigger>
            <TabsTrigger value="settings">{t('organizer.tabs.settings')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

const OrganizerWelcome: React.FC<{ user: User }> = ({ user }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg p-6 mb-8">
      <h1 className="text-2xl font-bold mb-2">{t('organizer.welcome').replace('{email}', user.email)}</h1>
      <p className="opacity-90">{t('organizer.dashboardTitle')}</p>
    </div>
  );
};

export default function OrganizerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [myEvents, setMyEvents] = useState<EventProps[]>([]);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const userString = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
    if (!userString) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userString);
    if (parsedUser.role !== 'organizer') {
      router.push('/select-role');
      return;
    }
    setUser(parsedUser);
    const sampleMyEvents = allEvents.slice(0, 3);
    setMyEvents(sampleMyEvents);
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <OrganizerNavigation />
      <div className="container mx-auto px-4 py-6">
        <OrganizerWelcome user={user} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Button 
            className="bg-purple-600 hover:bg-purple-700 h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={() => router.push('/organizer/events/create')}
          >
            <Calendar size={24} />
            <span>{t('organizer.createEvent')}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-purple-200"
            onClick={() => router.push('/organizer/tickets')}
          >
            <Users size={24} />
            <span>{t('organizer.manageTickets')}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-purple-200"
            onClick={() => router.push('/organizer/analytics')}
          >
            <BarChart2 size={24} />
            <span>{t('organizer.viewAnalytics')}</span>
          </Button>
        </div>
        {/* Event Performance Overview */}
        <h2 className="text-2xl font-bold mb-4">{t('organizer.eventPerformance')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <EventStatsCard 
            title={t('organizer.stats.totalEvents')} 
            value={myEvents.length.toString()} 
            icon={<Calendar className="h-5 w-5 text-purple-600" />} 
            trend={t('organizer.stats.trendEvents')} 
            trendUp={true}
          />
          <EventStatsCard 
            title={t('organizer.stats.totalAttendees')} 
            value="487" 
            icon={<Users className="h-5 w-5 text-purple-600" />} 
            trend={t('organizer.stats.trendAttendees')} 
            trendUp={true}
          />
          <EventStatsCard 
            title={t('organizer.stats.ticketsSold')} 
            value="352" 
            icon={<BarChart2 className="h-5 w-5 text-purple-600" />} 
            trend={t('organizer.stats.trendTickets')} 
            trendUp={true}
          />
          <EventStatsCard 
            title={t('organizer.stats.avgRating')} 
            value="4.7/5" 
            icon={<PieChart className="h-5 w-5 text-purple-600" />} 
            trend={t('organizer.stats.trendRating')} 
            trendUp={true}
          />
        </div>
        {/* Upcoming Events */}
        <h2 className="text-2xl font-bold mb-4">{t('organizer.myEvents')}</h2>
        <OrganizerEventsList events={myEvents} />
        <Separator className="my-8" />
        {/* Quick Links */}
        <h2 className="text-2xl font-bold mb-4">{t('organizer.quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: t('organizer.quick.speakers'), icon: <Users className="h-5 w-5" /> },
            { title: t('organizer.quick.notifications'), icon: <Calendar className="h-5 w-5" /> },
            { title: t('organizer.quick.reports'), icon: <BarChart2 className="h-5 w-5" /> },
            { title: t('organizer.quick.settings'), icon: <Settings className="h-5 w-5" /> },
          ].map((action, index) => (
            <Card key={index} className="hover:border-purple-300 cursor-pointer transition-all">
              <CardContent className="pt-6 flex items-center gap-3">
                {action.icon}
                <span className="font-medium">{action.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
