'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { LearningPath } from '@/types';
import { BookOpenIcon, ClockIcon, CheckCircleIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDashboard({ isOpen, onClose }: UserDashboardProps) {
  const { userProgress, refreshProgress } = useAuth();
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  if (!isOpen) return null;

  const activePaths = userProgress?.learningPaths?.filter(path => path.isActive) || [];
  const completedPaths = userProgress?.learningPaths?.filter(path => path.progress === 100) || [];

  const handleResourceComplete = async (pathId: string, stageIndex: number, resourceIndex: number, completed: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/user/progress/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pathId,
          stageIndex,
          resourceIndex,
          completed,
        }),
      });

      if (response.ok) {
        await refreshProgress();
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="glass-card w-full max-w-6xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="sticky top-0 bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl border-b border-white/20 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text">Your Learning Dashboard</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 border border-white/20 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Paths</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{activePaths.length}</p>
                </div>
                <BookOpenIcon className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="glass-card p-6 border border-white/20 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedPaths.length}</p>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="glass-card p-6 border border-white/20 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Resources Done</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProgress?.completedResources?.length || 0}</p>
                </div>
                <ClockIcon className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Active Learning Paths */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Learning Paths</h3>
            {activePaths.length === 0 ? (
              <div className="text-center py-12">
                <BookOpenIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No active learning paths yet.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Generate a new learning path to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {activePaths.map((path) => (
                  <div key={path.id} className="glass-card p-6 border border-white/20 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{path.topic}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span className="capitalize">{path.difficulty}</span>
                          <span>•</span>
                          <span>{path.estimatedTime}</span>
                          <span>•</span>
                          <span>{path.stages.length} stages</span>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(path.progress || 0)}`}
                              style={{ width: `${path.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {path.progress || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedPath(path)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <PlayIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Learning Paths */}
          {completedPaths.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Completed Learning Paths</h3>
              <div className="grid gap-4">
                {completedPaths.map((path) => (
                  <div key={path.id} className="glass-card p-6 border border-white/20 dark:border-gray-700 opacity-75">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{path.topic}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          <span>Completed</span>
                        </div>
                      </div>
                      <div className="text-green-500 font-medium">100%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Path Detail Modal */}
      {selectedPath && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="sticky top-0 bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl border-b border-white/20 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold gradient-text">{selectedPath.topic}</h3>
                <button
                  onClick={() => setSelectedPath(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(selectedPath.progress || 0)}`}
                      style={{ width: `${selectedPath.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedPath.progress || 0}%
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{selectedPath.description}</p>
              </div>

              <div className="space-y-6">
                {selectedPath.stages.map((stage, stageIndex) => (
                  <div key={stageIndex} className="glass-card p-6 border border-white/20 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{stage.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{stage.description}</p>
                      </div>
                      {stage.completed && (
                        <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                      )}
                    </div>

                    <div className="space-y-3">
                      {stage.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex items-center space-x-3 p-3 bg-white/5 dark:bg-gray-800/30 rounded-lg">
                          <input
                            type="checkbox"
                            checked={resource.completed || false}
                            onChange={(e) => handleResourceComplete(
                              selectedPath.id!,
                              stageIndex,
                              resourceIndex,
                              e.target.checked
                            )}
                            className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                          />
                          <div className="flex-1">
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                              {resource.title}
                            </a>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <span className="capitalize">{resource.type}</span>
                              {resource.duration && (
                                <>
                                  <span>•</span>
                                  <span>{resource.duration}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
