
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Send, Mail, MessageSquare, Users } from 'lucide-react';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    recipients: 'all'
  });

  const [pushData, setPushData] = useState({
    title: '',
    message: ''
  });

  const handleSendEmail = () => {
    console.log('Sending email:', emailData);
    // Here you would send the email
    setEmailData({ subject: '', message: '', recipients: 'all' });
  };

  const handleSendPush = () => {
    console.log('Sending push notification:', pushData);
    // Here you would send the push notification
    setPushData({ title: '', message: '' });
  };

  const notificationHistory = [
    { id: 1, type: 'Email', title: 'Event Reminder', sent: '2 hours ago', recipients: 245 },
    { id: 2, type: 'Push', title: 'New Event Available', sent: '1 day ago', recipients: 180 },
    { id: 3, type: 'Email', title: 'Weekly Newsletter', sent: '3 days ago', recipients: 320 },
    { id: 4, type: 'Push', title: 'Early Bird Pricing', sent: '1 week ago', recipients: 150 }
  ];

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
          <h1 className="text-3xl font-bold">Send Notifications</h1>
        </div>

        <Tabs defaultValue="email" className="space-y-6">
          <TabsList>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Campaign
            </TabsTrigger>
            <TabsTrigger value="push" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Push Notifications
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={emailData.recipients}
                    onChange={(e) => setEmailData({...emailData, recipients: e.target.value})}
                  >
                    <option value="all">All Attendees</option>
                    <option value="registered">Registered Only</option>
                    <option value="speakers">Speakers Only</option>
                    <option value="sponsors">Sponsors Only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailSubject">Subject</Label>
                  <Input
                    id="emailSubject"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                    placeholder="Enter email subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailMessage">Message</Label>
                  <textarea
                    id="emailMessage"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={8}
                    value={emailData.message}
                    onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                    placeholder="Compose your email message..."
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleSendEmail} className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Email
                  </Button>
                  <Button variant="outline">Save as Draft</Button>
                  <Button variant="outline">Preview</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="push">
            <Card>
              <CardHeader>
                <CardTitle>Push Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pushTitle">Notification Title</Label>
                  <Input
                    id="pushTitle"
                    value={pushData.title}
                    onChange={(e) => setPushData({...pushData, title: e.target.value})}
                    placeholder="Enter notification title"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500">{pushData.title.length}/50 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pushMessage">Message</Label>
                  <textarea
                    id="pushMessage"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={4}
                    value={pushData.message}
                    onChange={(e) => setPushData({...pushData, message: e.target.value})}
                    placeholder="Enter push notification message"
                    maxLength={120}
                  />
                  <p className="text-xs text-gray-500">{pushData.message.length}/120 characters</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Preview</h4>
                  <div className="bg-white p-3 rounded border shadow-sm max-w-sm">
                    <p className="font-medium text-sm">{pushData.title || 'Notification Title'}</p>
                    <p className="text-xs text-gray-600">{pushData.message || 'Notification message will appear here'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleSendPush} className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Push Notification
                  </Button>
                  <Button variant="outline">Schedule Later</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Notification History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationHistory.map((notification) => (
                    <div key={notification.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${notification.type === 'Email' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {notification.type === 'Email' ? 
                            <Mail className="h-4 w-4 text-blue-600" /> : 
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.type} • {notification.sent}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{notification.recipients} recipients</p>
                        <Button size="sm" variant="ghost">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Notifications;
