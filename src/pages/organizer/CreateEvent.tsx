import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin, Clock, Users, DollarSign, Image, Upload, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/useLanguage';
import MediaUpload from '../../components/organizer/MediaUpload';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: string;
  price: string;
  coverImage: File | null;
  mediaFiles: any[];
}

interface TabSettings {
  showDetails: boolean;
  showMedia: boolean;
  showTickets: boolean;
  showSpeakers: boolean;
  showSchedule: boolean;
  showSponsors: boolean;
  showExhibition: boolean;
}

const eventTypeDefaults: Record<string, Partial<TabSettings>> = {
  music: {
    showTickets: true,
    showSponsors: true,
    showSpeakers: false,
    showExhibition: false,
    showSchedule: false,
    showMedia: true,
    showDetails: true
  },
  conference: {
    showTickets: true,
    showSpeakers: true,
    showSchedule: true,
    showSponsors: true,
    showExhibition: false,
    showMedia: true,
    showDetails: true
  },
  workshop: {
    showTickets: true,
    showSpeakers: true,
    showSchedule: true,
    showSponsors: false,
    showExhibition: false,
    showMedia: true,
    showDetails: true
  },
  exhibition: {
    showTickets: true,
    showExhibition: true,
    showSponsors: true,
    showSpeakers: false,
    showSchedule: true,
    showMedia: true,
    showDetails: true
  },
  networking: {
    showTickets: true,
    showSponsors: true,
    showSpeakers: false,
    showExhibition: false,
    showSchedule: false,
    showMedia: true,
    showDetails: true
  },
  seminar: {
    showTickets: true,
    showSpeakers: true,
    showSchedule: true,
    showSponsors: false,
    showExhibition: false,
    showMedia: true,
    showDetails: true
  }
};

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [eventType, setEventType] = useState<string>('');
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: '',
    price: '',
    coverImage: null,
    mediaFiles: []
  });

  const [tabSettings, setTabSettings] = useState<TabSettings>({
    showDetails: false,
    showMedia: false,
    showTickets: false,
    showSpeakers: false,
    showSchedule: false,
    showSponsors: false,
    showExhibition: false
  });

  const handleEventTypeChange = (type: string) => {
    setEventType(type);
    const defaults = eventTypeDefaults[type];
    if (defaults) {
      setTabSettings(prev => ({
        ...prev,
        ...defaults
      }));
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      coverImage: file
    }));
  };

  const handleMediaFilesChange = (files: any[]) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: files
    }));
  };

  const handleTabSettingChange = (tab: keyof TabSettings, enabled: boolean) => {
    setTabSettings(prev => ({
      ...prev,
      [tab]: enabled
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event data:', formData);
    navigate('/organizer/dashboard');
  };

  const getVisibleTabsCount = () => {
    return 2 + Object.values(tabSettings).filter(Boolean).length; // Settings + Basic + enabled tabs
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('organizer.createEvent')}</h1>
          <p className="text-gray-600 mt-2">Create a new event for your attendees</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className={`grid w-full grid-cols-${Math.min(getVisibleTabsCount(), 6)}`}>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              {tabSettings.showDetails && <TabsTrigger value="details">Details</TabsTrigger>}
              {tabSettings.showMedia && <TabsTrigger value="media">Media</TabsTrigger>}
              {tabSettings.showTickets && <TabsTrigger value="tickets">Tickets</TabsTrigger>}
              {tabSettings.showSpeakers && <TabsTrigger value="speakers">Speakers</TabsTrigger>}
              {tabSettings.showSchedule && <TabsTrigger value="schedule">Schedule</TabsTrigger>}
              {tabSettings.showSponsors && <TabsTrigger value="sponsors">Sponsors</TabsTrigger>}
              {tabSettings.showExhibition && <TabsTrigger value="exhibition">Exhibition</TabsTrigger>}
            </TabsList>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Event Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your event type and choose which tabs to display
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select onValueChange={handleEventTypeChange} value={eventType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="music">Music Event</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="exhibition">Exhibition</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Tab Configuration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <Label htmlFor="show-details">Event Details</Label>
                        <Switch
                          id="show-details"
                          checked={tabSettings.showDetails}
                          onCheckedChange={(checked) => handleTabSettingChange('showDetails', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <Label htmlFor="show-media">Media</Label>
                        <Switch
                          id="show-media"
                          checked={tabSettings.showMedia}
                          onCheckedChange={(checked) => handleTabSettingChange('showMedia', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <Label htmlFor="show-tickets">Tickets</Label>
                        <Switch
                          id="show-tickets"
                          checked={tabSettings.showTickets}
                          onCheckedChange={(checked) => handleTabSettingChange('showTickets', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <Label htmlFor="show-speakers">Speakers</Label>
                        <Switch
                          id="show-speakers"
                          checked={tabSettings.showSpeakers}
                          onCheckedChange={(checked) => handleTabSettingChange('showSpeakers', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <Label htmlFor="show-schedule">Schedule</Label>
                        <Switch
                          id="show-schedule"
                          checked={tabSettings.showSchedule}
                          onCheckedChange={(checked) => handleTabSettingChange('showSchedule', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <Label htmlFor="show-sponsors">Sponsors</Label>
                        <Switch
                          id="show-sponsors"
                          checked={tabSettings.showSponsors}
                          onCheckedChange={(checked) => handleTabSettingChange('showSponsors', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <Label htmlFor="show-exhibition">Exhibition</Label>
                        <Switch
                          id="show-exhibition"
                          checked={tabSettings.showExhibition}
                          onCheckedChange={(checked) => handleTabSettingChange('showExhibition', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Tip:</strong> Select your event type to automatically configure the most relevant tabs. You can still customize them manually using the switches above.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Event Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your event"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cover-image">Cover Image</Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="cover-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          {formData.coverImage ? (
                            <div className="flex items-center space-x-2">
                              <Image className="h-5 w-5 text-purple-600" />
                              <span className="text-sm text-gray-700">{formData.coverImage.name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> event cover image
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                          )}
                          <input
                            id="cover-image"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {formData.coverImage && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(formData.coverImage)}
                            alt="Cover preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Event location or venue"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {tabSettings.showDetails && (
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Event Details
                    </CardTitle>
                    <CardDescription>
                      Additional details and settings for your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="seminar">Seminar</SelectItem>
                          <SelectItem value="networking">Networking</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={formData.capacity}
                          onChange={(e) => handleInputChange('capacity', e.target.value)}
                          placeholder="Maximum attendees"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {tabSettings.showMedia && (
              <TabsContent value="media" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Event Media
                    </CardTitle>
                    <CardDescription>
                      Upload images, videos, documents, and presentations for your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MediaUpload onFilesChange={handleMediaFilesChange} />
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {tabSettings.showTickets && (
              <TabsContent value="tickets" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Ticket Settings
                    </CardTitle>
                    <CardDescription>
                      Configure ticket types and pricing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Ticket configuration will be available soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {tabSettings.showSpeakers && (
              <TabsContent value="speakers" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Speakers</CardTitle>
                    <CardDescription>
                      Manage event speakers and presenters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Speaker management will be available soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {tabSettings.showSchedule && (
              <TabsContent value="schedule" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>
                      Create and manage event schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Schedule management will be available soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {tabSettings.showSponsors && (
              <TabsContent value="sponsors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sponsors</CardTitle>
                    <CardDescription>
                      Manage event sponsors and partnerships
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Sponsor management will be available soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {tabSettings.showExhibition && (
              <TabsContent value="exhibition" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Exhibition</CardTitle>
                    <CardDescription>
                      Manage exhibition booths and displays
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Exhibition management will be available soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          <div className="mt-8 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/organizer/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateEvent;
