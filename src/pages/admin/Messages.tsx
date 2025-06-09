
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Search, 
  Filter,
  Reply,
  Archive,
  Trash2,
  Clock,
  User
} from 'lucide-react';

const AdminMessages: React.FC = () => {
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

  const messages = [
    {
      id: 1,
      from: "john.doe@example.com",
      subject: "Payment Issue",
      message: "I'm having trouble with my payment processing...",
      priority: "high",
      status: "unread",
      createdAt: "2024-01-15T10:30:00Z",
      category: "billing"
    },
    {
      id: 2,
      from: "jane.smith@example.com",
      subject: "Feature Request",
      message: "Would love to see integration with...",
      priority: "medium",
      status: "read",
      createdAt: "2024-01-14T15:20:00Z",
      category: "feature"
    },
    {
      id: 3,
      from: "mike.johnson@example.com",
      subject: "Bug Report",
      message: "Found an issue with the event creation form...",
      priority: "high",
      status: "replied",
      createdAt: "2024-01-14T09:45:00Z",
      category: "bug"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-500';
      case 'read': return 'bg-gray-500';
      case 'replied': return 'bg-green-500';
      default: return 'bg-gray-500';
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
            <h1 className="text-3xl font-bold">Message Management</h1>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-50">
                3 Unread
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="inbox" className="space-y-6">
            <TabsList>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="replied">Replied</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search messages..." 
                  className="pl-10" 
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <TabsContent value="inbox">
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id} className={message.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{message.subject}</h3>
                            <Badge className={`${getPriorityColor(message.priority)} text-white text-xs`}>
                              {message.priority}
                            </Badge>
                            <Badge className={`${getStatusColor(message.status)} text-white text-xs`}>
                              {message.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {message.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <User className="h-4 w-4" />
                            <span>{message.from}</span>
                            <Clock className="h-4 w-4 ml-4" />
                            <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-700 mb-4">{message.message}</p>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex items-center gap-1">
                              <Reply className="h-3 w-3" />
                              Reply
                            </Button>
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              <Archive className="h-3 w-3" />
                              Archive
                            </Button>
                            <Button size="sm" variant="outline" className="flex items-center gap-1 text-red-600">
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="replied">
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No replied messages</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="archived">
              <Card>
                <CardContent className="p-6 text-center">
                  <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No archived messages</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminMessages;
