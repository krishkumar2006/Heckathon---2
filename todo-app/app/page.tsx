'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated === 'true') {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">Loading...</h1>
        <p className="text-gray-600">Redirecting you to the appropriate page</p>
      </div>
    </div>
  );
}