
import React from 'react';
import { Users, Calendar, TrendingUp, MessageSquare } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  percentage: string;
  isIncrease: boolean;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentage, isIncrease, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className={isIncrease ? 'text-green-600' : 'text-red-600'}>
        {isIncrease ? '+' : '-'}{percentage}
      </span>
      <span className="ml-2 text-sm text-gray-600">since last month</span>
    </div>
  </div>
);

const AdminStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value="2,745"
        percentage="12%"
        isIncrease={true}
        icon={<Users className="h-6 w-6 text-white" />}
        color="bg-primary"
      />
      <StatCard
        title="Total Events"
        value="1,234"
        percentage="8%"
        isIncrease={true}
        icon={<Calendar className="h-6 w-6 text-white" />}
        color="bg-primary/80"
      />
      <StatCard
        title="Revenue"
        value="$83,291"
        percentage="5%"
        isIncrease={true}
        icon={<TrendingUp className="h-6 w-6 text-white" />}
        color="bg-green-500"
      />
      <StatCard
        title="Support Tickets"
        value="48"
        percentage="3%"
        isIncrease={false}
        icon={<MessageSquare className="h-6 w-6 text-white" />}
        color="bg-orange-500"
      />
    </div>
  );
};

export default AdminStats;
