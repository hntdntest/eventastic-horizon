import React from 'react';
import Link from 'next/link';
import { 
  Users, Settings, ShieldCheck, Database,
  BarChart, MessageSquare, Bell, Calendar
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Events', path: '/admin/events', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="h-5 w-5" /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'Database', path: '/admin/database', icon: <Database className="h-5 w-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
    { name: 'Security', path: '/admin/security', icon: <ShieldCheck className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 p-2 mb-6">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
