"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { Settings, Mail, Bell, Shield } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const router = useRouter();

  // Check if user has admin role
  React.useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role !== 'admin') {
        router.push('/select-role');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex items-center mb-6">
            <Settings className="mr-2 h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold">System Settings</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="emails">Email Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Site Configuration</h2>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="site-name">Site Name</Label>
                      <Input id="site-name" defaultValue="Eventomorrow" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="site-url">Site URL</Label>
                      <Input id="site-url" defaultValue="https://eventomorrow.com" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input id="admin-email" type="email" defaultValue="admin@eventomorrow.com" />
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold pt-4">Features</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-registration">Allow User Registration</Label>
                        <p className="text-sm text-gray-500">Enable or disable new user registrations</p>
                      </div>
                      <Switch id="enable-registration" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-organizer-applications">Allow Organizer Applications</Label>
                        <p className="text-sm text-gray-500">Allow users to apply for organizer accounts</p>
                      </div>
                      <Switch id="enable-organizer-applications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                        <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
                      </div>
                      <Switch id="maintenance-mode" />
                    </div>
                  </div>
                </div>
                
                <Button className="mt-6">Save Settings</Button>
              </TabsContent>
              
              <TabsContent value="emails" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Email Configuration</h2>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" defaultValue="smtp.example.com" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-username">SMTP Username</Label>
                    <Input id="smtp-username" defaultValue="notifications@eventomorrow.com" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-smtp-auth">Use SMTP Authentication</Label>
                      <p className="text-sm text-gray-500">Enable SMTP authentication for sending emails</p>
                    </div>
                    <Switch id="enable-smtp-auth" defaultChecked />
                  </div>
                </div>
                
                <Button className="mt-6">Save Email Settings</Button>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-2fa">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <Switch id="enable-2fa" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout</Label>
                      <p className="text-sm text-gray-500">Automatically log users out after inactivity</p>
                    </div>
                    <Switch id="session-timeout" defaultChecked />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="session-time">Session Timeout (minutes)</Label>
                    <Input id="session-time" type="number" defaultValue="30" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password-policy">Minimum Password Length</Label>
                    <Input id="password-policy" type="number" defaultValue="8" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require-special-chars">Require Special Characters</Label>
                      <p className="text-sm text-gray-500">Passwords must include special characters</p>
                    </div>
                    <Switch id="require-special-chars" defaultChecked />
                  </div>
                </div>
                
                <Button className="mt-6">Save Security Settings</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminSettings;
