import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart2, Users, Settings, PieChart } from 'lucide-react';
// import { EventProps } from '../../components/events/EventCard';
// import EventList from '../../components/events/EventList';
// import { allEvents } from '../../data/sampleEvents';
import { Separator } from "@/components/ui/separator";
import OrganizerEventsList from '../../components/organizer/OrganizerEventsList';
import EventStatsCard from '../../components/organizer/EventStatsCard';
import { useLanguage } from '@/contexts/useLanguage';

interface User {
  email: string;
  role: string;
}

const OrganizerNavigation: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleTabClick = (value: string) => {
    switch (value) {
      case 'dashboard':
        navigate('/organizer/dashboard');
        break;
      case 'events':
        // For now, stay on dashboard but could navigate to a dedicated events page
        navigate('/organizer/dashboard');
        break;
      case 'tickets':
        navigate('/organizer/tickets');
        break;
      case 'sponsors':
        navigate('/organizer/sponsors');
        break;
      case 'analytics':
        navigate('/organizer/analytics');
        break;
      case 'settings':
        navigate('/organizer/settings');
        break;
    }
  };

  return (
    <div className="bg-white shadow-sm border-b mb-6">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger 
              value="dashboard" 
              onClick={() => handleTabClick('dashboard')}
            >
              {t('organizer.tabs.dashboard')}
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              onClick={() => handleTabClick('events')}
            >
              {t('organizer.tabs.myEvents')}
            </TabsTrigger>
            <TabsTrigger 
              value="tickets" 
              onClick={() => handleTabClick('tickets')}
            >
              {t('organizer.tabs.tickets')}
            </TabsTrigger>
            <TabsTrigger 
              value="sponsors" 
              onClick={() => handleTabClick('sponsors')}
            >
              {t('organizer.tabs.sponsors')}
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              onClick={() => handleTabClick('analytics')}
            >
              {t('organizer.tabs.analytics')}
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              onClick={() => handleTabClick('settings')}
            >
              {t('organizer.tabs.settings')}
            </TabsTrigger>
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';

const OrganizerDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  // Use the same event type as OrganizerEventsList
  const [myEvents, setMyEvents] = useState<Array<{
    id: string;
    title: Record<string, string> | string;
    description?: Record<string, string> | string;
    category?: Record<string, string> | string;
    location?: Record<string, string> | string;
    startDate?: string;
    endDate?: string;
    imageUrl?: string;
  }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(totalEvents / PAGE_SIZE);

  // Reset về trang 1 nếu số lượng sự kiện thay đổi hoặc searchTerm thay đổi
  React.useEffect(() => {
    setCurrentPage(1);
  }, [totalEvents, searchTerm]);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userString);
    if (parsedUser.role !== 'organizer') {
      navigate('/select-role');
      return;
    }
    setUser(parsedUser);

    // Fetch paginated events from backend, with search
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: PAGE_SIZE.toString(),
    });
    if (searchTerm) params.append('q', searchTerm);
    fetch(`${API_URL}/events?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        let eventsArr = Array.isArray(data.data) ? data.data : [];
        eventsArr = eventsArr.map((ev) => ({
          id: ev.id as string,
          title: ev.title as Record<string, string> | string,
          description: ev.description as Record<string, string> | string,
          category: ev.category as Record<string, string> | string,
          location: ev.location as Record<string, string> | string,
          startDate: ev.startDate as string,
          endDate: ev.endDate as string,
          imageUrl: (ev.imageUrl as string) || '/placeholder.svg',
        }));
        setMyEvents(eventsArr);
        setTotalEvents(data.total || 0);
      })
      .catch(() => {
        setMyEvents([]);
        setTotalEvents(0);
      });
  }, [navigate, currentPage, searchTerm]);

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
            onClick={() => navigate('/organizer/events/create')}
          >
            <Calendar size={24} />
            <span>{t('organizer.createEvent')}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-purple-200"
            onClick={() => navigate('/organizer/tickets')}
          >
            <Users size={24} />
            <span>{t('organizer.manageTickets')}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-purple-200"
            onClick={() => navigate('/organizer/analytics')}
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
            value={totalEvents.toString()} 
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
        {/* Search box for events */}
        <div className="mb-4 flex items-center justify-end gap-2">
          <input
            type="text"
            placeholder={t('organizer.searchEvents') || 'Search events...'}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="border rounded px-3 py-2 w-full max-w-xs"
            onKeyDown={e => { if (e.key === 'Enter') setSearchTerm(searchInput); }}
            aria-label={t('organizer.searchEvents') || 'Search events'}
          />
          <Button
            onClick={() => setSearchTerm(searchInput)}
            className="ml-2"
            variant="default"
          >
            {t('organizer.search') || 'Search'}
          </Button>
        </div>
        {/* Pagination for My Events */}
        <OrganizerEventsList events={myEvents} />
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border bg-white disabled:opacity-50"
            >
              {t('organizer.previous') || 'Previous'}
            </button>
            <span className="px-3 py-1">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border bg-white disabled:opacity-50"
            >
              {t('organizer.next') || 'Next'}
            </button>
          </div>
        )}
        <Separator className="my-8" />
        {/* Quick Links */}
        <h2 className="text-2xl font-bold mb-4">{t('organizer.quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: t('organizer.quick.speakers'), icon: <Users className="h-5 w-5" />, path: '/organizer/speakers' },
            { title: t('organizer.quick.notifications'), icon: <Calendar className="h-5 w-5" />, path: '/organizer/notifications' },
            { title: t('organizer.quick.reports'), icon: <BarChart2 className="h-5 w-5" />, path: '/organizer/reports' },
            { title: t('organizer.quick.settings'), icon: <Settings className="h-5 w-5" />, path: '/organizer/settings' },
          ].map((action, index) => (
            <Card 
              key={index} 
              className="hover:border-purple-300 cursor-pointer transition-all"
              onClick={() => navigate(action.path)}
            >
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
};

export default OrganizerDashboard;
