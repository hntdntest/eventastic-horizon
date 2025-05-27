'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import RoleSelect from '@/app/components/auth/RoleSelect';

export default function SelectRolePage() {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    const userString = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
    if (userString) {
      const user = JSON.parse(userString);
      const updatedUser = { ...user, role };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      switch (role) {
        case 'attendee':
          router.push('/attendee/dashboard');
          break;
        case 'organizer':
          router.push('/organizer/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/');
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <RoleSelect onRoleSelect={handleRoleSelect} />
    </div>
  );
}
