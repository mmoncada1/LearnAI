'use client';

import { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  HeartIcon, 
  ShareIcon, 
  BookmarkIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareApp = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Learn Anything With AI',
        text: 'Check out this amazing AI-powered learning path generator!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg glow-effect hover:scale-110 transition-all duration-300 flex items-center justify-center group bounce-in"
        >
          <ChevronUpIcon className="w-6 h-6 group-hover:animate-bounce" />
        </button>
      )}

      {/* Action buttons (when expanded) */}
      {isExpanded && (
        <div className="flex flex-col space-y-3 bounce-in">
          <button
            onClick={toggleLike}
            className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group hover:scale-110 ${
              isLiked 
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white glow-effect' 
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 backdrop-blur-sm border border-gray-200 dark:border-gray-700'
            }`}
          >
            {isLiked ? (
              <HeartIconSolid className="w-6 h-6 animate-pulse" />
            ) : (
              <HeartIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            )}
          </button>

          <button
            onClick={shareApp}
            className="w-12 h-12 bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 rounded-full shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          >
            <ShareIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </button>

          <button
            className="w-12 h-12 bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 rounded-full shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          >
            <BookmarkIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-full shadow-xl glow-effect transition-all duration-300 flex items-center justify-center group relative overflow-hidden ${
          isExpanded ? 'rotate-45 scale-110' : 'hover:scale-110'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <SparklesIcon className={`w-7 h-7 relative z-10 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:rotate-12'}`} />
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 animate-ping opacity-20"></div>
      </button>
    </div>
  );
}
