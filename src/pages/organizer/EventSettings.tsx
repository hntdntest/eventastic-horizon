
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Settings, Trash2 } from 'lucide-react';
import { allEvents } from '../../data/sampleEvents';
import { useLanguage } from '@/contexts/useLanguage';

const EventSettings: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    const foundEvent = allEvents.find(e => e.id === eventId);
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
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      console.log('Deleting event:', eventId);
      navigate('/organizer/dashboard');
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Event Settings - "{event.title}"
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPublic">Make event public</Label>
                  <Switch
                    id="isPublic"
                    checked={settings.isPublic}
                    onCheckedChange={(checked) => handleSettingChange('isPublic', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allowRegistration">Allow registration</Label>
                  <Switch
                    id="allowRegistration"
                    checked={settings.allowRegistration}
                    onCheckedChange={(checked) => handleSettingChange('allowRegistration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sendReminders">Send email reminders</Label>
                  <Switch
                    id="sendReminders"
                    checked={settings.sendReminders}
                    onCheckedChange={(checked) => handleSettingChange('sendReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireApproval">Require approval for registration</Label>
                  <Switch
                    id="requireApproval"
                    checked={settings.requireApproval}
                    onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enableWaitlist">Enable waitlist</Label>
                  <Switch
                    id="enableWaitlist"
                    checked={settings.enableWaitlist}
                    onCheckedChange={(checked) => handleSettingChange('enableWaitlist', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
                <Button variant="outline" onClick={() => navigate('/organizer/dashboard')}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-red-600 mb-2">Delete Event</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete an event, there is no going back. Please be certain.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteEvent}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Event
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
