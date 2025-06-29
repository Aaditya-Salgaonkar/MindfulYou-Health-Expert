'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load profile', err);
        setError(err.response?.data?.error || 'Error fetching profile');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return <div className="p-6 text-gray-600">Loading profile…</div>;

  return (
    <div className="rounded-2xl">
      <div className="flex items-center justify-center gap-4 mb-2">
        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-md font-bold">
          {user.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </div>
        <div>
          <h2 className="text-md font-semibold">{user.name}</h2>
        </div>
      </div>
            <div>
         
          <p className="text-gray-500 text-sm mb-2 text-center">{user.email}</p>
        </div>
    </div>
  );
}
