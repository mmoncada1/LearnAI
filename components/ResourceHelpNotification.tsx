import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function ResourceHelpNotification() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
            About Learning Resources
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
            All resources are carefully curated from trusted educational platforms. If a link doesn&apos;t work:
          </p>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 ml-4">
            <li>• Try refreshing the page or opening in a new tab</li>
            <li>• Check if the site requires registration (most are free)</li>
            <li>• Search for the resource title if the direct link fails</li>
          </ul>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-2"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
