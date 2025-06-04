// Next.js version of Settings migrated from Vite
'use client';
import React, { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Switch } from '@/app/components/ui/switch';
import { ArrowLeft, Save, User, Bell, Shield, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Settings: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: 'John Organizer',
    email: 'john@example.com',
    company: 'Event Pro Inc.',
    phone: '+1 (555) 123-4567',
    bio: 'Professional event organizer with 10+ years experience'
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailReminders: true,
    pushNotifications: false,
    weeklyReports: true
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    loginAlerts: true
  });

  const handleSaveProfile = () => {
    console.log('Saving profile:', profile);
  };

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications);
  };

  const handleSaveSecurity = () => {
    console.log('Saving security:', security);
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
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  />
                </div>
                <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Booking Notifications</Label>
                    <p className="text-sm text-gray-600">Receive emails when someone books your events</p>
                  </div>
                  <Switch
                    checked={notifications.emailBookings}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailBookings: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Reminders</Label>
                    <p className="text-sm text-gray-600">Get reminded about upcoming events</p>
                  </div>
                  <Switch
                    checked={notifications.emailReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailReminders: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-gray-600">Get weekly analytics reports</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                  />
                </div>
                <Button onClick={handleSaveNotifications} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(checked) => setSecurity({...security, twoFactor: checked})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified of login attempts</p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity({...security, loginAlerts: checked})}
                  />
                </div>
                <Button onClick={handleSaveSecurity} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800">Pro Plan</h3>
                  <p className="text-green-700">$29/month - Unlimited events</p>
                  <p className="text-sm text-green-600">Next billing: January 15, 2024</p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Payment Method</h4>
                  <div className="p-3 border rounded-lg">
                    <p>**** **** **** 4532</p>
                    <p className="text-sm text-gray-600">Expires 12/25</p>
                  </div>
                  <Button variant="outline">Update Payment Method</Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Billing History</h4>
                  <div className="space-y-2">
                    {['Dec 2023 - $29.00', 'Nov 2023 - $29.00', 'Oct 2023 - $29.00'].map((bill, index) => (
                      <div key={index} className="flex justify-between p-2 border-b">
                        <span>{bill}</span>
                        <Button size="sm" variant="ghost">Download</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
