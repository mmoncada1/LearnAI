// Curated list of reliable learning resources with their domains and search patterns
export const RELIABLE_RESOURCE_DOMAINS = {
  video: [
    'youtube.com',
    'vimeo.com',
    'coursera.org',
    'udemy.com',
    'pluralsight.com',
    'egghead.io'
  ],
  course: [
    'freecodecamp.org',
    'codecademy.com',
    'coursera.org',
    'edx.org',
    'udacity.com',
    'khanacademy.org',
    'udemy.com',
    'pluralsight.com'
  ],
  documentation: [
    'developer.mozilla.org',
    'docs.python.org',
    'reactjs.org',
    'nodejs.org',
    'w3schools.com',
    'developer.android.com',
    'docs.microsoft.com'
  ],
  article: [
    'medium.com',
    'dev.to',
    'css-tricks.com',
    'smashingmagazine.com',
    'a-list-apart.com',
    'hackernoon.com'
  ],
  practice: [
    'codepen.io',
    'jsfiddle.net',
    'replit.com',
    'github.com',
    'leetcode.com',
    'hackerrank.com',
    'frontendmentor.io'
  ]
};

// High-quality learning resources that are known to work
export const CURATED_RESOURCES = {
  'web development': {
    beginner: [
      {
        title: "freeCodeCamp Responsive Web Design",
        url: "https://www.freecodecamp.org/learn/responsive-web-design/",
        type: "course" as const,
        duration: "300 hours"
      },
      {
        title: "MDN Web Docs - Getting Started",
        url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web",
        type: "documentation" as const,
        duration: "5 hours"
      }
    ],
    intermediate: [
      {
        title: "JavaScript30 - Build 30 things in 30 days",
        url: "https://javascript30.com/",
        type: "course" as const,
        duration: "30 days"
      }
    ]
  },
  'javascript': {
    beginner: [
      {
        title: "MDN JavaScript Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        type: "documentation" as const,
        duration: "20 hours"
      },
      {
        title: "JavaScript Crash Course",
        url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
        type: "video" as const,
        duration: "1.5 hours"
      }
    ]
  },
  'react': {
    beginner: [
      {
        title: "React Official Tutorial",
        url: "https://react.dev/learn",
        type: "documentation" as const,
        duration: "10 hours"
      },
      {
        title: "React Course for Beginners",
        url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        type: "video" as const,
        duration: "3 hours"
      }
    ]
  },
  'python': {
    beginner: [
      {
        title: "Python.org Official Tutorial",
        url: "https://docs.python.org/3/tutorial/",
        type: "documentation" as const,
        duration: "15 hours"
      },
      {
        title: "Python for Everybody Specialization",
        url: "https://www.coursera.org/specializations/python",
        type: "course" as const,
        duration: "8 months"
      }
    ]
  }
};

export function validateResourceUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    // Check if it's from a reliable domain
    const allDomains = Object.values(RELIABLE_RESOURCE_DOMAINS).flat();
    return allDomains.some(trustedDomain => 
      domain.includes(trustedDomain.toLowerCase())
    );
  } catch {
    return false;
  }
}

export function getCuratedResources(topic: string, difficulty: string) {
  const normalizedTopic = topic.toLowerCase();
  const normalizedDifficulty = difficulty.toLowerCase();
  
  // Try to find exact matches first
  for (const [key, resources] of Object.entries(CURATED_RESOURCES)) {
    if (normalizedTopic.includes(key)) {
      const resourceSet = resources as any;
      return resourceSet[normalizedDifficulty] || resourceSet.beginner || [];
    }
  }
  
  return [];
}
