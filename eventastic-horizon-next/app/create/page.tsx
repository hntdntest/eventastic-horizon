'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRedirectPage() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
      router.replace('/login?redirectAfterLogin=/create');
      return;
    }
    const user = JSON.parse(userString);
    if (user.role === 'organizer') {
      router.replace('/organizer/events/create');
    } else if (user.role === 'attendee') {
      setShowAlert(true);
    } else {
      router.replace('/select-role');
    }
  }, [router]);

  useEffect(() => {
    if (showAlert) {
      alert('Bạn cần quyền organizer để tạo sự kiện.');
      router.replace('/');
    }
  }, [showAlert, router]);

  return null;
}