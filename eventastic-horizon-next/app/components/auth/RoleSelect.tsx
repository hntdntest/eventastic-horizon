import React from 'react';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { User, Users, ShieldCheck } from 'lucide-react';

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, icon, onSelect }) => {
  return (
    <Card className="hover:border-primary transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Role specific features could be listed here */}
      </CardContent>
      <CardFooter>
        <Button onClick={onSelect} className="w-full bg-primary hover:bg-primary-dark">
          Continue as {title}
        </Button>
      </CardFooter>
    </Card>
  );
};

const RoleSelect: React.FC<{ onRoleSelect: (role: string) => void }> = ({ onRoleSelect }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-8">Select your role</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RoleCard
          title="Attendee"
          description="Discover and register for events, view your tickets, and manage your attendance."
          icon={<User className="h-6 w-6 text-primary" />}
          onSelect={() => onRoleSelect('attendee')}
        />
        <RoleCard
          title="Organizer"
          description="Create and manage events, track registrations, and analyze attendance."
          icon={<Users className="h-6 w-6 text-primary" />}
          onSelect={() => onRoleSelect('organizer')}
        />
        <RoleCard
          title="Admin"
          description="Manage the platform, users, and system settings."
          icon={<ShieldCheck className="h-6 w-6 text-primary" />}
          onSelect={() => onRoleSelect('admin')}
        />
      </div>
    </div>
  );
};

export default RoleSelect;
