'use client';

import { useState } from 'react';
import { LearningPath, GeneratePathRequest } from '@/types';
import { useAuth } from '@/lib/AuthContext';
import LearningPathDisplay from '@/components/LearningPathDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import ThemeToggle from '@/components/ThemeToggle';
import FloatingActionButton from '@/components/FloatingActionButton';
import SuccessAnimation from '@/components/SuccessAnimation';
import TypingEffect from '@/components/TypingEffect';
import AuthModal from '@/components/AuthModal';
import UserProfile from '@/components/UserProfile';
import UserDashboard from '@/components/UserDashboard';
import Notification from '@/components/Notification';
import { BookOpenIcon, SparklesIcon, AcademicCapIcon, UserIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { sampleLearningPath } from '@/lib/sampleData';

export default function AppContent() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
  }>({ message: '', type: 'success', show: false });
  
  const { isAuthenticated, user, userProgress } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic you want to learn');
      return;
    }

    setLoading(true);
    setError(null);
    setLearningPath(null);

    try {
      const request: GeneratePathRequest = {
        topic: topic.trim(),
        difficulty,
      };

      const response = await fetch('/api/generate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate learning path');
      }

      const path: LearningPath = await response.json();
      setShowSuccess(true);
      
      // If user is authenticated, save the learning path
      if (isAuthenticated) {
        await saveLearningPath(path);
      }
      
      setTimeout(() => {
        setLearningPath(path);
        setShowSuccess(false);
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const saveLearningPath = async (path: LearningPath) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(path),
      });

      if (response.ok) {
        setNotification({
          message: 'Learning path saved successfully!',
          type: 'success',
          show: true,
        });
      } else {
        console.error('Failed to save learning path');
      }
    } catch (error) {
      console.error('Error saving learning path:', error);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type, show: true });
  };

  const handleReset = () => {
    setLearningPath(null);
    setTopic('');
    setDifficulty('beginner');
    setError(null);
  };

  const handleDemo = () => {
    setLearningPath(sampleLearningPath);
    setError(null);
  };

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="glass-card border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-lg glow-effect float-animation">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">SkillMapAI</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">Personalized learning paths powered by AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <ChartBarIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                  <UserProfile />
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:from-primary-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
              <div className="floating-card">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!learningPath ? (
          <div className="max-w-2xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl glow-effect float-animation">
                    <BookOpenIcon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-6xl font-bold gradient-text pulse-glow">→</div>
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-2xl glow-effect float-animation" style={{animationDelay: '2s'}}>
                    <AcademicCapIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center mb-8">
                <h2 className="text-5xl md:text-6xl font-bold bounce-in whitespace-nowrap gradient-text">
                  Learn <TypingEffect 
                    texts={[
                      'Anything',
                      'Coding',
                      'Design',
                      'Marketing',
                      'Calculus',
                      'AI & ML',
                      'Business',
                      'Languages'
                    ]}
                    className="gradient-text"
                    speed={150}
                    deleteSpeed={100}
                    delay={1500}
                  />
                </h2>
              </div>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Enter any skill or topic, and we&apos;ll create a <span className="gradient-text font-semibold">personalized learning roadmap</span> with curated resources just for you.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="card space-y-8">
              <div className="space-y-2">
                <label htmlFor="topic" className="block text-lg font-semibold gradient-text mb-3">
                  🎯 Learning Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="input-field text-lg"
                  placeholder="e.g., Full-stack web development, Python programming, Digital marketing..."
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="difficulty" className="block text-lg font-semibold gradient-text mb-3">
                  🎯 Experience Level
                </label>
                <div className="select-wrapper">                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="select-field text-lg"
                  disabled={loading}
                >
                    <option value="beginner">🌱 Beginner - I&apos;m new to this</option>
                    <option value="intermediate">🌿 Intermediate - I have some experience</option>
                    <option value="advanced">🌳 Advanced - I want to deepen my knowledge</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-red-700 dark:text-red-300 text-base font-medium">⚠️ {error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="btn-primary w-full text-lg group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" variant="brain" />
                      <span>✨ Generating your learning path...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Generate Learning Path</span>
                    </>
                  )}
                </div>
                {loading && <div className="absolute inset-0 shimmer"></div>}
              </button>
            </form>

            {/* Examples */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold gradient-text mb-8 text-center">🔥 Popular Learning Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Frontend Development', emoji: '🎨', color: 'from-blue-500 to-cyan-500' },
                  { name: 'Data Science with Python', emoji: '📊', color: 'from-green-500 to-emerald-500' },
                  { name: 'Digital Marketing', emoji: '📱', color: 'from-pink-500 to-rose-500' },
                  { name: 'Mobile App Development', emoji: '📲', color: 'from-purple-500 to-violet-500' },
                  { name: 'Machine Learning', emoji: '🤖', color: 'from-orange-500 to-amber-500' },
                  { name: 'UX/UI Design', emoji: '🎭', color: 'from-indigo-500 to-blue-500' }
                ].map((example, index) => (
                  <button
                    key={example.name}
                    onClick={() => setTopic(example.name)}
                    className="group relative p-6 bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-sm hover-lift"
                    disabled={loading}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${example.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div className="relative z-10 text-left">
                      <div className="text-3xl mb-3">{example.emoji}</div>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                        {example.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <LearningPathDisplay 
              learningPath={learningPath} 
              onReset={handleReset}
              onSavePrompt={() => setShowAuthModal(true)}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Success Animation */}
      <SuccessAnimation 
        show={showSuccess}
        message="Learning Path Generated!"
        onComplete={() => setShowSuccess(false)}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* User Dashboard */}
      <UserDashboard isOpen={showDashboard} onClose={() => setShowDashboard(false)} />

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}
