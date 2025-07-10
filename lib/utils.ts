export const getResourceTypeColor = (type: string): string => {
  switch (type) {
    case 'video':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'article':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'course':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'practice':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'documentation':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const formatDuration = (duration: string): string => {
  // Convert various duration formats to a consistent format
  const lowerDuration = duration.toLowerCase();
  
  // Handle common patterns
  if (lowerDuration.includes('hour')) {
    return duration;
  }
  if (lowerDuration.includes('min')) {
    return duration;
  }
  if (lowerDuration.includes('week')) {
    return duration;
  }
  
  // Default return
  return duration;
};

export const calculateTotalTime = (stages: any[]): string => {
  // This could be enhanced to actually calculate total time from resources
  const stageCount = stages.length;
  
  if (stageCount <= 3) return '4-6 weeks';
  if (stageCount <= 5) return '8-10 weeks';
  if (stageCount <= 7) return '12-16 weeks';
  return '16+ weeks';
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
