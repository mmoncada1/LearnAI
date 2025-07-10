'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  message?: string;
}

export default function SuccessAnimation({ show, onComplete, message = "Success!" }: SuccessAnimationProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!show) {
      setStage(0);
      return;
    }

    const stages = [
      () => setStage(1), // Show initial animation
      () => setStage(2), // Show check mark
      () => setStage(3), // Show message
      () => {
        setStage(4); // Start fade out
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    ];

    const timeouts = [
      setTimeout(stages[0], 100),
      setTimeout(stages[1], 600),
      setTimeout(stages[2], 1000),
      setTimeout(stages[3], 2000),
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${stage === 4 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Sparkles animation */}
        {stage >= 1 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <SparklesIcon
                key={i}
                className={`absolute w-6 h-6 text-yellow-400 animate-ping transition-all duration-1000 ${
                  stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-60px)`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        )}

        {/* Main success circle */}
        <div className={`relative transition-all duration-700 ease-out ${
          stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}>
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
            
            {stage >= 2 && (
              <CheckCircleIcon className={`w-16 h-16 text-white relative z-10 transition-all duration-500 ${
                stage >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`} />
            )}
          </div>
          
          {/* Ripple effect */}
          {stage >= 1 && (
            <>
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30"></div>
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>

        {/* Success message */}
        {stage >= 3 && (
          <div className={`mt-8 text-center transition-all duration-500 ${
            stage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h3 className="text-2xl font-bold gradient-text mb-2">{message}</h3>
            <p className="text-gray-600 dark:text-gray-400">Your learning path is ready!</p>
          </div>
        )}
      </div>
    </div>
  );
}
