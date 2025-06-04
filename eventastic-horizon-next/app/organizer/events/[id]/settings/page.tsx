// Next.js version of EventSettings migrated from Vite
'use client';
import React, { useEffect, useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { ArrowLeft, Settings, Trash2 } from 'lucide-react';
import { allEvents } from '@/app/data/sampleEvents';
import { useLanguage } from '@/app/contexts/useLanguage';
import { useParams, useRouter } from 'next/navigation';

const EventSettings: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const eventId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [event, setEvent] = useState<any>(null);
  const [settings, setSettings] = useState({
    isPublic: true,
    allowRegistration: true,
    sendReminders: true,
    requireApproval: false,
    maxAttendees: 100,
    enableWaitlist: false
  });

  useEffect(() => {
    // Find the event
    const foundEvent = allEvents.find((e: any) => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
    }
  }, [eventId]);

  const handleSettingChange = (setting: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // Here you would typically save to a backend
  };

  const handleDeleteEvent = () => {
    if (window.confirm(t('organizer.deleteEventConfirm') || 'Are you sure you want to delete this event? This action cannot be undone.')) {
      console.log('Deleting event:', eventId);
      router.push('/organizer/dashboard');
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t('organizer.eventSettingsTitle')?.replace('{event}', event.title) || `Event Settings - "${event.title}"`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPublic">{t('organizer.settings.isPublic') || 'Make event public'}</Label>
                  <Switch
                    id="isPublic"
                    checked={settings.isPublic}
                    onCheckedChange={(checked: boolean) => handleSettingChange('isPublic', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allowRegistration">{t('organizer.settings.allowRegistration') || 'Allow registration'}</Label>
                  <Switch
                    id="allowRegistration"
                    checked={settings.allowRegistration}
                    onCheckedChange={(checked: boolean) => handleSettingChange('allowRegistration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sendReminders">{t('organizer.settings.sendReminders') || 'Send email reminders'}</Label>
                  <Switch
                    id="sendReminders"
                    checked={settings.sendReminders}
                    onCheckedChange={(checked: boolean) => handleSettingChange('sendReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireApproval">{t('organizer.settings.requireApproval') || 'Require approval for registration'}</Label>
                  <Switch
                    id="requireApproval"
                    checked={settings.requireApproval}
                    onCheckedChange={(checked: boolean) => handleSettingChange('requireApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enableWaitlist">{t('organizer.settings.enableWaitlist') || 'Enable waitlist'}</Label>
                  <Switch
                    id="enableWaitlist"
                    checked={settings.enableWaitlist}
                    onCheckedChange={(checked: boolean) => handleSettingChange('enableWaitlist', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <Button onClick={handleSaveSettings}>
                  {t('organizer.saveSettings') || 'Save Settings'}
                </Button>
                <Button variant="outline" onClick={() => router.push('/organizer/dashboard')}>
                  {t('organizer.cancel') || 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">{t('organizer.dangerZone') || 'Danger Zone'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-red-600 mb-2">{t('organizer.deleteEvent') || 'Delete Event'}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('organizer.deleteEventWarning') || 'Once you delete an event, there is no going back. Please be certain.'}
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteEvent}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('organizer.deleteEvent') || 'Delete Event'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventSettings;
