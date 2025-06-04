// Next.js version of Reports migrated from Vite
'use client';
import React, { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ArrowLeft, Download, FileText, BarChart3, Calendar, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Reports: React.FC = () => {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const reports = [
    { 
      id: 1, 
      title: 'Event Performance Report', 
      type: 'Performance', 
      period: 'December 2023', 
      status: 'Ready',
      description: 'Detailed analysis of event attendance, engagement, and feedback'
    },
    { 
      id: 2, 
      title: 'Revenue Summary', 
      type: 'Financial', 
      period: 'Q4 2023', 
      status: 'Ready',
      description: 'Complete breakdown of ticket sales, sponsorship revenue, and expenses'
    },
    { 
      id: 3, 
      title: 'Attendee Demographics', 
      type: 'Demographics', 
      period: 'December 2023', 
      status: 'Processing',
      description: 'Comprehensive demographic analysis of event participants'
    },
    { 
      id: 4, 
      title: 'Marketing Performance', 
      type: 'Marketing', 
      period: 'December 2023', 
      status: 'Ready',
      description: 'Analysis of marketing channels, conversion rates, and ROI'
    }
  ];

  const quickStats = [
    { title: 'Total Events', value: '45', change: '+12%', icon: Calendar },
    { title: 'Total Revenue', value: '$67,500', change: '+25%', icon: DollarSign },
    { title: 'Avg Attendance', value: '85%', change: '+8%', icon: BarChart3 },
    { title: 'Satisfaction', value: '4.8/5', change: '+0.2', icon: FileText }
  ];

  const handleDownloadReport = (reportId: number) => {
    console.log(`Downloading report ${reportId}`);
  };

  const handleGenerateReport = () => {
    console.log(`Generating new report for ${selectedPeriod}`);
  };

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
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">View Reports</h1>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change} from last period</p>
                    </div>
                    <IconComponent className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList>
            <TabsTrigger value="available">Available Reports</TabsTrigger>
            <TabsTrigger value="generate">Generate New Report</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{report.title}</h3>
                        <p className="text-gray-600">{report.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {report.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {report.period}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === 'Ready' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={report.status !== 'Ready'}
                          onClick={() => handleDownloadReport(report.id)}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Report Type</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option>Event Performance</option>
                        <option>Financial Summary</option>
                        <option>Attendee Demographics</option>
                        <option>Marketing Analysis</option>
                        <option>Custom Report</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Time Period</label>
                      <select 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                      >
                        <option value="weekly">Last Week</option>
                        <option value="monthly">Last Month</option>
                        <option value="quarterly">Last Quarter</option>
                        <option value="yearly">Last Year</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Include Events</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          All Events
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Conferences Only
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Workshops Only
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Format</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option>PDF Report</option>
                        <option>Excel Spreadsheet</option>
                        <option>CSV Data</option>
                        <option>PowerPoint Presentation</option>
                      </select>
                    </div>
                  </div>
                </div>
                <Button onClick={handleGenerateReport} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Weekly Performance Summary</p>
                      <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Disable</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Revenue Report</p>
                      <p className="text-sm text-gray-600">1st of every month at 10:00 AM</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Disable</Button>
                    </div>
                  </div>
                  <Button className="w-full">Add New Scheduled Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
