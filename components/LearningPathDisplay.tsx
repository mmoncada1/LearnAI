'use client';

import { useState } from 'react';
import { LearningPath, LearningStage } from '@/types';
import { 
  CheckCircleIcon, 
  PlayIcon, 
  DocumentTextIcon, 
  AcademicCapIcon,
  ClockIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import LinkValidator from './LinkValidator';
import ResourceHelpNotification from './ResourceHelpNotification';

interface LearningPathDisplayProps {
  learningPath: LearningPath;
  onReset: () => void;
}

export default function LearningPathDisplay({ learningPath, onReset }: LearningPathDisplayProps) {
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());

  const toggleStageComplete = (stageIndex: number) => {
    const newCompleted = new Set(completedStages);
    if (newCompleted.has(stageIndex)) {
      newCompleted.delete(stageIndex);
    } else {
      newCompleted.add(stageIndex);
    }
    setCompletedStages(newCompleted);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="w-4 h-4" />;
      case 'article':
        return <DocumentTextIcon className="w-4 h-4" />;
      case 'course':
        return <AcademicCapIcon className="w-4 h-4" />;
      default:
        return <ArrowTopRightOnSquareIcon className="w-4 h-4" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-700';
      case 'article':
        return 'bg-blue-100 text-blue-700';
      case 'course':
        return 'bg-green-100 text-green-700';
      case 'practice':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const progressPercentage = (completedStages.size / learningPath.stages.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Resource Help Notification */}
      <ResourceHelpNotification />
      
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {learningPath.topic}
            </h1>
            <p className="text-gray-600 mb-4">{learningPath.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>{learningPath.estimatedTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="capitalize">{learningPath.difficulty}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{learningPath.stages.length} stages</span>
              </div>
            </div>
          </div>
          <button
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>New Path</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {completedStages.size} of {learningPath.stages.length} completed
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Learning Stages */}
      <div className="space-y-6">
        {learningPath.stages.map((stage, index) => {
          const isCompleted = completedStages.has(index);
          
          return (
            <div 
              key={index}
              className={`card transition-all duration-200 ${
                isCompleted ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Stage Number & Checkbox */}
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isCompleted 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <button
                    onClick={() => toggleStageComplete(index)}
                    className="transition-colors duration-200"
                  >
                    {isCompleted ? (
                      <CheckCircleIconSolid className="w-6 h-6 text-green-600" />
                    ) : (
                      <CheckCircleIcon className="w-6 h-6 text-gray-400 hover:text-green-500" />
                    )}
                  </button>
                </div>

                {/* Stage Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xl font-semibold mb-2 ${
                    isCompleted ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {stage.title}
                  </h3>
                  <p className={`mb-4 ${
                    isCompleted ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {stage.description}
                  </p>

                  {/* Resources */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                        Resources
                      </h4>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <CheckCircleIcon className="w-3 h-3 text-green-600" />
                          <span>Verified</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                          <span>External link</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      {stage.resources.map((resource, resourceIndex) => (
                        <a
                          key={resourceIndex}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
                        >
                          <div className={`p-2 rounded-lg ${getResourceTypeColor(resource.type || 'article')}`}>
                            {getResourceIcon(resource.type || 'article')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors duration-200">
                                {resource.title}
                              </h5>
                              <LinkValidator url={resource.url} />
                              <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {resource.type && (
                                <span className="text-xs text-gray-500 capitalize">
                                  {resource.type}
                                </span>
                              )}
                              {resource.duration && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-xs text-gray-500">
                                    {resource.duration}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedStages.size === learningPath.stages.length && (
        <div className="card bg-green-50 border-green-200 animate-slide-up">
          <div className="text-center py-6">
            <CheckCircleIconSolid className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-900 mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-green-700 mb-4">
              You've completed your learning path for {learningPath.topic}!
            </p>
            <button
              onClick={onReset}
              className="btn-primary"
            >
              Start a New Learning Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
