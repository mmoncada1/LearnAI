'use client';

import { useState } from 'react';
import { LearningPath, GeneratePathRequest } from '@/types';
import LearningPathDisplay from '@/components/LearningPathDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BookOpenIcon, SparklesIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { sampleLearningPath } from '@/lib/sampleData';

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setLearningPath(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl">
              <SparklesIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learn Anything With AI</h1>
              <p className="text-gray-600 mt-1">Get personalized learning paths for any skill or topic</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!learningPath ? (
          <div className="max-w-2xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                    <BookOpenIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-gray-400">→</div>
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full">
                    <AcademicCapIcon className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What do you want to learn?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Enter any skill or topic, and we'll create a personalized learning roadmap with curated resources just for you.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="card space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Full-stack web development, Python programming, Digital marketing..."
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="input-field"
                  disabled={loading}
                >
                  <option value="beginner">Beginner - I'm new to this</option>
                  <option value="intermediate">Intermediate - I have some experience</option>
                  <option value="advanced">Advanced - I want to deepen my knowledge</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Generating your learning path...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Generate Learning Path</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-gray-500">or</span>
              </div>

              <button
                type="button"
                onClick={handleDemo}
                disabled={loading}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <AcademicCapIcon className="w-5 h-5" />
                <span>View Demo Learning Path</span>
              </button>
            </form>

            {/* Examples */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Popular Learning Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Frontend Development',
                  'Data Science with Python',
                  'Digital Marketing',
                  'Mobile App Development',
                  'Machine Learning',
                  'UX/UI Design'
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setTopic(example)}
                    className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200"
                    disabled={loading}
                  >
                    <span className="text-gray-700 font-medium">{example}</span>
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
            />
            {/* Demo Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleDemo}
                className="btn-secondary inline-flex items-center justify-center space-x-2"
              >
                <SparklesIcon className="w-5 h-5" />
                <span>Show Demo Learning Path</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
