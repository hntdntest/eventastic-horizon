'use client';
import { useState, useEffect } from 'react';
import EventList from '@/app/components/events/EventList';
import { allEvents } from '@/app/data/sampleEvents';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useLanguage } from '@/app/contexts/useLanguage';
import MainLayout from '@/app/components/layout/MainLayout';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(allEvents);
  const [activeTab, setActiveTab] = useState('all');
  const { t } = useLanguage();

  useEffect(() => {
    let results = allEvents;
    if (searchTerm) {
      results = results.filter(
        event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeTab !== 'all') {
      results = results.filter(event => event.type.toLowerCase() === activeTab.toLowerCase());
    }
    setFilteredEvents(results);
  }, [searchTerm, activeTab]);

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">{t('events.title')}</h1>
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder={t('events.search.placeholder')}
                className="pl-10 py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                className="absolute right-1 top-1 bg-oceanBlue hover:bg-oceanBlue-dark" 
                onClick={() => setSearchTerm(searchTerm)}
              >
                {t('events.search.button')}
              </Button>
            </div>
            {/* Event Type Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 md:grid-cols-5">
                <TabsTrigger value="all">{t('events.tabs.all')}</TabsTrigger>
                <TabsTrigger value="technology">{t('events.tabs.technology')}</TabsTrigger>
                <TabsTrigger value="music">{t('events.tabs.music')}</TabsTrigger>
                <TabsTrigger value="sports">{t('events.tabs.sports')}</TabsTrigger>
                <TabsTrigger value="investment">{t('events.tabs.investment')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="container mx-auto px-4 py-10">
          {filteredEvents.length > 0 ? (
            <>
              <p className="mb-6 text-gray-600">
                {t('events.results').replace('{count}', filteredEvents.length.toString())}
              </p>
              <EventList events={filteredEvents} />
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">{t('events.noResults.title')}</h3>
              <p className="text-gray-600 mb-6">{t('events.noResults.subtitle')}</p>
              <Button onClick={() => {setSearchTerm(''); setActiveTab('all');}}>{t('events.noResults.button')}</Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}