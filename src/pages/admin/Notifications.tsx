
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Send, 
  Users, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AdminNotifications: React.FC = () => {
  const navigate = useNavigate();

  // Check if user has admin role
  React.useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role !== 'admin') {
        navigate('/select-role');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const notifications = [
    {
      id: 1,
      title: "System Maintenance",
      message: "Scheduled maintenance on March 15th",
      type: "system",
      status: "sent",
      recipients: 1250,
      sentAt: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      title: "New Feature Release",
      message: "Exciting new features are now available",
      type: "feature",
      status: "draft",
      recipients: 0,
      sentAt: null
    },
    {
      id: 3,
      title: "Security Alert",
      message: "Important security update required",
      type: "security",
      status: "scheduled",
      recipients: 1250,
      sentAt: "2024-01-20T09:00:00Z"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'bg-blue-500';
      case 'feature': return 'bg-green-500';
      case 'security': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'draft': return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Notification Management</h1>
            <Button className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Notification
            </Button>
          </div>

          <Tabs defaultValue="send" className="space-y-6">
            <TabsList>
              <TabsTrigger value="send">Send Notification</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="send">
              <Card>
                <CardHeader>
                  <CardTitle>Send New Notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input placeholder="Notification title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      placeholder="Enter your notification message here..." 
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Audience</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="all">All Users</option>
                        <option value="organizers">Organizers Only</option>
                        <option value="attendees">Attendees Only</option>
                        <option value="premium">Premium Users</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="general">General</option>
                        <option value="system">System</option>
                        <option value="feature">Feature</option>
                        <option value="security">Security</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button>Send Now</Button>
                    <Button variant="outline">Schedule</Button>
                    <Button variant="outline">Save as Draft</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card key={notification.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{notification.title}</h3>
                            <Badge className={`${getTypeColor(notification.type)} text-white`}>
                              {notification.type}
                            </Badge>
                            {getStatusIcon(notification.status)}
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{notification.recipients} recipients</span>
                            </div>
                            {notification.sentAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(notification.sentAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {notification.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Welcome Message</h4>
                      <p className="text-sm text-gray-600">Welcome new users to the platform</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Event Reminder</h4>
                      <p className="text-sm text-gray-600">Remind users about upcoming events</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">System Maintenance</h4>
                      <p className="text-sm text-gray-600">Notify users about scheduled maintenance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminNotifications;
