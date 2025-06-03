
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from 'lucide-react';
import { allEvents } from '../../data/sampleEvents';
import { useLanguage } from '@/contexts/useLanguage';

const EditEvent: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    const foundEvent = allEvents.find(e => e.id === eventId);
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
    navigate('/organizer/dashboard');
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

        <Card>
          <CardHeader>
            <CardTitle>Edit Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => navigate('/organizer/dashboard')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EditEvent;
