"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import AdminUsersList from '@/app/components/admin/AdminUsersList';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Filter, Plus, RefreshCcw, Search, UserPlus } from 'lucide-react';

const AdminUsers: React.FC = () => {
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">User Management</h1>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add New User
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-10" 
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>

            <AdminUsersList />
            
            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-gray-600">Showing 1-5 of 145 users</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminUsers;
