import { LearningPath } from '@/types';

export const sampleLearningPath: LearningPath = {
  topic: "Frontend Web Development",
  difficulty: "beginner",
  estimatedTime: "10-12 weeks",
  description: "Learn to build modern, responsive websites from scratch using HTML, CSS, JavaScript, and React.",
  stages: [
    {
      title: "HTML Fundamentals",
      description: "Learn the structure and semantic elements of web pages",
      resources: [
        {
          title: "freeCodeCamp HTML Course",
          url: "https://www.freecodecamp.org/learn/responsive-web-design/",
          type: "course",
          duration: "5 hours"
        },
        {
          title: "MDN HTML Basics",
          url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics",
          type: "documentation",
          duration: "2 hours"
        }
      ]
    },
    {
      title: "CSS Styling & Layout",
      description: "Style your web pages and create responsive layouts",
      resources: [
        {
          title: "CSS Grid & Flexbox Course",
          url: "https://cssgrid.io/",
          type: "course",
          duration: "4 hours"
        },
        {
          title: "CSS-Tricks Complete Guide",
          url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
          type: "article",
          duration: "1 hour"
        }
      ]
    },
    {
      title: "JavaScript Basics",
      description: "Add interactivity to your websites with JavaScript",
      resources: [
        {
          title: "JavaScript30 Course",
          url: "https://javascript30.com/",
          type: "course",
          duration: "10 hours"
        },
        {
          title: "MDN JavaScript Guide",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
          type: "documentation",
          duration: "8 hours"
        }
      ]
    },
    {
      title: "DOM Manipulation",
      description: "Learn to interact with web page elements dynamically",
      resources: [
        {
          title: "DOM Manipulation Crash Course",
          url: "https://www.youtube.com/watch?v=0ik6X4DJKCc",
          type: "video",
          duration: "1 hour"
        },
        {
          title: "Interactive DOM Projects",
          url: "https://github.com/bradtraversy/vanillawebprojects",
          type: "practice",
          duration: "15 hours"
        }
      ]
    },
    {
      title: "React Introduction",
      description: "Build dynamic user interfaces with React",
      resources: [
        {
          title: "React Official Tutorial",
          url: "https://react.dev/learn",
          type: "documentation",
          duration: "6 hours"
        },
        {
          title: "React Course for Beginners",
          url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
          type: "video",
          duration: "3 hours"
        }
      ]
    },
    {
      title: "Building Projects",
      description: "Apply your skills by building real-world projects",
      resources: [
        {
          title: "Frontend Mentor Challenges",
          url: "https://www.frontendmentor.io/challenges",
          type: "practice",
          duration: "20 hours"
        },
        {
          title: "Build a Portfolio Website",
          url: "https://www.youtube.com/watch?v=xV7S8BhIeBo",
          type: "video",
          duration: "2 hours"
        }
      ]
    }
  ]
};
