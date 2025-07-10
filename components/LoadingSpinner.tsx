interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dots' | 'pulse' | 'brain';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', variant = 'default', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-gradient-to-r from-primary-500 to-purple-500 rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`${sizeClasses[size]} relative ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 rounded-full h-full w-full"></div>
      </div>
    );
  }

  if (variant === 'brain') {
    return (
      <div className={`${sizeClasses[size]} relative ${className}`}>
        <div className="absolute inset-0">
          <div className="h-full w-full rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
        </div>
        <div className="absolute inset-1">
          <div className="h-full w-full rounded-full border-2 border-purple-500 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <div className="absolute inset-2 flex items-center justify-center">
          <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
