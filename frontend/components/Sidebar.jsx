'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  BookOpen,
  BarChart2,
  LogOut,
  Wind,
  Dumbbell,
} from 'lucide-react';
import UserProfile from './UserList';
export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Guest User';
    setUserName(name);
  }, []);

  const menuItems = [
    { label: 'Dashboard', icon: <Home />,   path: '/dashboard' },
    { label: 'Journal',   icon: <BookOpen />,path: '/journal'   },
    { label: 'Analytics', icon: <BarChart2 />,path: '/analytics' },
    { label: 'Meditation',  icon: <Wind />, path: '/meditation'   },
    { label: 'Exercise',  icon: <Dumbbell />, path: '/exercise'   },
  ];

  const handleSelect = (path) => {
    if (pathname !== path) router.push(path);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  // Generate initials from name
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white/40 backdrop-blur-lg border-r border-white/30 shadow-2xl flex flex-col justify-between z-50">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500">
          MindfulYou
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map(({ label, icon, path }) => {
          const isActive = pathname === path;
          return (
            <div
              key={label}
              onClick={() => handleSelect(path)}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all
                ${isActive
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'hover:bg-white/50 hover:shadow hover:text-gray-900 text-gray-700'}
              `}
            >
              <span className="w-6 h-6">{icon}</span>
              <span className="font-medium">{label}</span>
            </div>
          );
        })}
      </nav>

      {/* User Info & Sign Out */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-3 mb-4">
         <UserProfile />
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/60 backdrop-blur-md hover:bg-white/80 text-gray-800 font-semibold transition"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
