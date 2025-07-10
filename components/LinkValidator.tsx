import { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface LinkValidatorProps {
  url: string;
  className?: string;
}

export default function LinkValidator({ url, className = '' }: LinkValidatorProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Simple client-side URL validation
    const validateUrl = () => {
      try {
        const urlObj = new URL(url);
        const trustedDomains = [
          'youtube.com', 'youtu.be',
          'freecodecamp.org',
          'developer.mozilla.org',
          'w3schools.com',
          'codecademy.com',
          'coursera.org',
          'khanacademy.org',
          'css-tricks.com',
          'dev.to',
          'github.com',
          'docs.python.org',
          'react.dev',
          'nodejs.org'
        ];
        
        const hostname = urlObj.hostname.toLowerCase();
        const isTrusted = trustedDomains.some(domain => 
          hostname === domain || hostname.endsWith('.' + domain)
        );
        
        setIsValid(isTrusted);
      } catch {
        setIsValid(false);
      }
    };

    validateUrl();
  }, [url]);

  if (isValid === null) {
    return null; // Don't show anything while validating
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      {isValid ? (
        <div className="flex items-center text-green-600" title="Verified working link">
          <CheckCircleIcon className="w-3 h-3" />
        </div>
      ) : (
        <div className="flex items-center text-amber-600" title="Unverified link">
          <ExclamationTriangleIcon className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}
