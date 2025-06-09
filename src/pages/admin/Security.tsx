
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key,
  AlertTriangle,
  Lock,
  Eye,
  Activity,
  Users,
  Globe,
  Settings
} from 'lucide-react';

const AdminSecurity: React.FC = () => {
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

  const securityEvents = [
    {
      id: 1,
      type: 'login_attempt',
      user: 'john.doe@example.com',
      ip: '192.168.1.100',
      location: 'San Francisco, CA',
      status: 'success',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'failed_login',
      user: 'unknown@example.com',
      ip: '45.123.45.67',
      location: 'Unknown',
      status: 'blocked',
      timestamp: '2024-01-15T09:45:00Z'
    },
    {
      id: 3,
      type: 'password_change',
      user: 'jane.smith@example.com',
      ip: '192.168.1.101',
      location: 'New York, NY',
      status: 'success',
      timestamp: '2024-01-14T16:20:00Z'
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_attempt': return <Users className="h-4 w-4 text-green-500" />;
      case 'failed_login': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'password_change': return <Key className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'blocked': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
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
            <h1 className="text-3xl font-bold">Security Management</h1>
            <Badge className="bg-green-500 text-white">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="access">Access Control</TabsTrigger>
              <TabsTrigger value="logs">Security Logs</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <p className="text-xs text-muted-foreground">
                      Excellent security level
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">247</div>
                    <p className="text-xs text-muted-foreground">
                      Currently online
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">12</div>
                    <p className="text-xs text-muted-foreground">
                      Last 24 hours
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Security Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span>Enable two-factor authentication for all admin accounts</span>
                      </div>
                      <Button size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>SSL certificate is properly configured</span>
                      </div>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Access Control Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">IP Whitelist</p>
                        <p className="text-sm text-gray-600">Restrict admin access to specific IPs</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session Timeout</p>
                        <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>IP Whitelist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input placeholder="Enter IP address" />
                        <Button>Add IP</Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="font-mono">192.168.1.0/24</span>
                          <Button size="sm" variant="outline">Remove</Button>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="font-mono">10.0.0.0/8</span>
                          <Button size="sm" variant="outline">Remove</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Recent Security Events</h3>
                  <Button variant="outline">Export Logs</Button>
                </div>
                
                {securityEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getEventIcon(event.type)}
                          <div>
                            <p className="font-medium capitalize">{event.type.replace('_', ' ')}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{event.user}</span>
                              <span>{event.ip}</span>
                              <span>{event.location}</span>
                              <span>{new Date(event.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(event.status)} text-white`}>
                          {event.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Password Policy</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Minimum length: 8 characters</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Require special characters</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Require numbers</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Login Attempts</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          defaultValue="5" 
                          className="w-20"
                        />
                        <span className="text-sm">maximum failed attempts before lockout</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Session Timeout</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          defaultValue="30" 
                          className="w-20"
                        />
                        <span className="text-sm">minutes of inactivity</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Backup & Recovery</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full">Download Security Backup</Button>
                    <Button variant="outline" className="w-full">Test Recovery Process</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminSecurity;
