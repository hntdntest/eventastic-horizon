"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import AdminStats from '@/app/components/admin/AdminStats';
import AdminUsersList from '@/app/components/admin/AdminUsersList';

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  // Check if user has admin role
  React.useEffect(() => {
    const userString = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
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
        <div className="w-full md:w-3/4 space-y-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <AdminStats />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            <AdminUsersList />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
