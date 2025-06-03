
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Analytics: React.FC = () => {
  const navigate = useNavigate();

  const monthlyData = [
    { month: 'Jan', events: 4, attendees: 120, revenue: 6000 },
    { month: 'Feb', events: 6, attendees: 180, revenue: 9000 },
    { month: 'Mar', events: 8, attendees: 240, revenue: 12000 },
    { month: 'Apr', events: 5, attendees: 150, revenue: 7500 },
    { month: 'May', events: 10, attendees: 300, revenue: 15000 },
    { month: 'Jun', events: 12, attendees: 360, revenue: 18000 }
  ];

  const eventTypeData = [
    { name: 'Conferences', value: 40, color: '#8884d8' },
    { name: 'Workshops', value: 30, color: '#82ca9d' },
    { name: 'Seminars', value: 20, color: '#ffc658' },
    { name: 'Networking', value: 10, color: '#ff7300' }
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
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold">45</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +12% from last month
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                  <p className="text-3xl font-bold">1,350</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +18% from last month
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold">$67,500</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +25% from last month
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-3xl font-bold">4.8</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +0.2 from last month
                  </p>
                </div>
                <div className="text-yellow-500 text-2xl">⭐</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Events & Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill="#8884d8" name="Events" />
                  <Bar dataKey="attendees" fill="#82ca9d" name="Attendees" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Tech Conference 2024', attendees: 250, rating: 4.9 },
                  { name: 'AI Workshop Series', attendees: 180, rating: 4.8 },
                  { name: 'Startup Networking', attendees: 120, rating: 4.7 },
                  { name: 'Digital Marketing Seminar', attendees: 90, rating: 4.6 }
                ].map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-gray-600">{event.attendees} attendees</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">⭐ {event.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
