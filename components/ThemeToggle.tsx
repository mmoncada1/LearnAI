'use client';

import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="p-3 rounded-2xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm w-12 h-12 border border-white/30 dark:border-gray-700/30">
        {/* Placeholder to prevent layout shift */}
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-2xl bg-white/20 hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-700/30 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 transition-all duration-300 transform hover:scale-110 hover:rotate-12 group shadow-lg hover:shadow-xl"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative z-10">
        {theme === 'light' ? (
          <MoonIcon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 transition-colors duration-300" />
        ) : (
          <SunIcon className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300" />
        )}
      </div>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
    </button>
  );
}
