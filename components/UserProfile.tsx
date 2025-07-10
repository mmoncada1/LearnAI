'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { UserIcon, ChevronDownIcon, CogIcon, ChartBarIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export default function UserProfile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout, userProgress } = useAuth();

  if (!user) return null;

  const completedPaths = userProgress?.learningPaths?.filter(path => path.progress === 100) || [];
  const activePaths = userProgress?.learningPaths?.filter(path => path.isActive && (path.progress || 0) < 100) || [];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{activePaths.length} active paths</p>
        </div>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 glass-card border border-white/20 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-white/20 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-white/20 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Progress Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-2">
                  <BookOpenIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activePaths.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full mb-2">
                  <ChartBarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{completedPaths.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-2">
                  <CogIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{userProgress?.completedResources?.length || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Resources</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
