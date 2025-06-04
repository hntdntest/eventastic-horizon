// Next.js version of EditEvent migrated from Vite
'use client';
import React, { useEffect, useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { allEvents } from '@/app/data/sampleEvents';
import { useLanguage } from '@/app/contexts/useLanguage';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

const EditEvent: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const eventId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [event, setEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    type: ''
  });

  useEffect(() => {
    // Find the event
    const foundEvent = allEvents.find((e: any) => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
      setFormData({
        title: foundEvent.title,
        description: 'Sample event description',
        date: foundEvent.date,
        location: foundEvent.location,
        price: foundEvent.price.toString(),
        type: foundEvent.type
      });
    }
  }, [eventId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving event:', formData);
    // Here you would typically save to a backend
    router.push('/organizer/dashboard');
  };

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
            <CardTitle>{t('organizer.editEventTitle') || 'Edit Event'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t('organizer.basic.eventName') || 'Event Title'}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">{t('organizer.basic.category') || 'Event Type'}</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('type', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">{t('organizer.basic.startDate') || 'Date'}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{t('organizer.basic.location') || 'Location'}</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{t('organizer.tickets.price') || 'Price'}</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('price', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('organizer.basic.description') || 'Description'}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t('organizer.saveChanges') || 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => router.push('/organizer/dashboard')}>
                {t('organizer.cancel') || 'Cancel'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EditEvent;
