
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  HardDrive,
  Activity,
  Download,
  Upload,
  RefreshCcw,
  AlertTriangle,
  CheckCircle,
  Server
} from 'lucide-react';

const AdminDatabase: React.FC = () => {
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

  const dbStats = {
    totalSize: '2.4 GB',
    usedSpace: 68,
    totalRecords: 145000,
    tables: [
      { name: 'users', records: 1250, size: '45 MB', status: 'healthy' },
      { name: 'events', records: 850, size: '120 MB', status: 'healthy' },
      { name: 'tickets', records: 5400, size: '89 MB', status: 'healthy' },
      { name: 'sessions', records: 15600, size: '234 MB', status: 'warning' },
      { name: 'notifications', records: 8900, size: '56 MB', status: 'healthy' }
    ]
  };

  const backups = [
    {
      id: 1,
      name: 'daily_backup_2024_01_15',
      size: '2.1 GB',
      createdAt: '2024-01-15T02:00:00Z',
      status: 'completed'
    },
    {
      id: 2,
      name: 'daily_backup_2024_01_14',
      size: '2.0 GB',
      createdAt: '2024-01-14T02:00:00Z',
      status: 'completed'
    },
    {
      id: 3,
      name: 'daily_backup_2024_01_13',
      size: '1.9 GB',
      createdAt: '2024-01-13T02:00:00Z',
      status: 'completed'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
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
            <h1 className="text-3xl font-bold">Database Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Backup Now
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="backups">Backups</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dbStats.totalSize}</div>
                    <Progress value={dbStats.usedSpace} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {dbStats.usedSpace}% used
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dbStats.totalRecords.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Across all tables
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Status</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">Healthy</div>
                    <p className="text-xs text-muted-foreground">
                      All systems operational
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tables">
              <div className="space-y-4">
                {dbStats.tables.map((table, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-gray-500" />
                          <div>
                            <h3 className="font-semibold capitalize">{table.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{table.records.toLocaleString()} records</span>
                              <span>{table.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(table.status)}
                          <Badge variant="outline" className="capitalize">
                            {table.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="backups">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Backup Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Daily Automatic Backup</p>
                        <p className="text-sm text-gray-600">Every day at 2:00 AM</p>
                      </div>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Backups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {backups.map((backup) => (
                        <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Server className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{backup.name}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{backup.size}</span>
                                <span>{new Date(backup.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 text-white">{backup.status}</Badge>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="maintenance">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Database Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        Optimize Tables
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Rebuild Indexes
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Import Data
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Weekly Optimization</p>
                          <p className="text-sm text-gray-600">Every Sunday at 3:00 AM</p>
                        </div>
                        <Badge className="bg-blue-500 text-white">Scheduled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Monthly Index Rebuild</p>
                          <p className="text-sm text-gray-600">First Sunday of each month</p>
                        </div>
                        <Badge className="bg-blue-500 text-white">Scheduled</Badge>
                      </div>
                    </div>
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

export default AdminDatabase;
