import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { LearningPath } from '@/types';
import { validateResourceUrl, getCuratedResources, RELIABLE_RESOURCE_DOMAINS } from '@/lib/resources';

export async function POST(request: NextRequest) {
  try {
    // Check for API key first
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please check environment variables.' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client inside the function
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { topic, difficulty, timeCommitment, priorExperience } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const prompt = `Generate a comprehensive learning path for: "${topic}"

Requirements:
- Difficulty level: ${difficulty}
- Time commitment: ${timeCommitment || 'Flexible'}
- Prior experience: ${priorExperience || 'None specified'}

CRITICAL: Only use REAL, WORKING URLs from these trusted domains:
- YouTube (youtube.com) - for video content
- freeCodeCamp (freecodecamp.org) - for comprehensive courses
- MDN Web Docs (developer.mozilla.org) - for documentation
- Coursera (coursera.org) - for structured courses
- Khan Academy (khanacademy.org) - for beginner content
- W3Schools (w3schools.com) - for tutorials
- Codecademy (codecademy.com) - for interactive learning
- GitHub (github.com) - for practice projects
- Dev.to (dev.to) - for articles
- CSS-Tricks (css-tricks.com) - for web development

EXAMPLES of REAL URLs to use:
- https://www.freecodecamp.org/learn/responsive-web-design/
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- https://www.youtube.com/watch?v=hdI2bqOjy3c (JavaScript Crash Course)
- https://react.dev/learn
- https://docs.python.org/3/tutorial/
- https://www.w3schools.com/html/
- https://css-tricks.com/snippets/css/complete-guide-grid/

Please provide a JSON response with the following structure:
{
  "topic": "string",
  "difficulty": "${difficulty}",
  "estimatedTime": "string (e.g., '8-12 weeks')",
  "description": "Brief overview of what they'll learn",
  "stages": [
    {
      "title": "Stage title",
      "description": "What they'll learn in this stage",
      "resources": [
        {
          "title": "Resource name",
          "url": "REAL WORKING URL from trusted domains above",
          "type": "video|article|course|documentation|practice",
          "duration": "estimated time"
        }
      ]
    }
  ]
}

Guidelines:
- Create 5-8 logical learning stages
- Include 2-4 high-quality, real resources per stage
- ONLY use URLs from the trusted domains listed above
- Make it progressive - each stage builds on the previous
- Include hands-on practice opportunities
- Be specific and actionable
- Verify URLs are real and accessible

Focus on creating a realistic, achievable learning path with genuine, working resources.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Updated to use available model
      messages: [
        {
          role: "system",
          content: "You are an expert learning path designer. Create comprehensive, practical learning roadmaps with real, working resource links. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    let learningPath: LearningPath;
    try {
      learningPath = JSON.parse(responseText);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        learningPath = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Validate the response structure
    if (!learningPath.topic || !learningPath.stages || !Array.isArray(learningPath.stages)) {
      throw new Error('Invalid learning path structure');
    }

    // Validate and enhance resources with fallbacks
    const curatedResources = getCuratedResources(topic, difficulty);
    
    learningPath.stages = learningPath.stages.map((stage, stageIndex) => {
      // Filter out invalid URLs and add fallback resources if needed
      const validResources = stage.resources.filter(resource => 
        resource.url && validateResourceUrl(resource.url)
      );
      
      // If we don't have enough valid resources, add curated ones
      if (validResources.length < 2 && curatedResources.length > 0) {
        const fallbackResource = curatedResources[stageIndex % curatedResources.length];
        if (fallbackResource) {
          validResources.push(fallbackResource);
        }
      }
      
      return {
        ...stage,
        resources: validResources.length > 0 ? validResources : [{
          title: "Search for resources on this topic",
          url: `https://www.google.com/search?q=${encodeURIComponent(stage.title + ' tutorial')}`,
          type: "article" as const,
          duration: "Variable"
        }]
      };
    });

    return NextResponse.json(learningPath);

  } catch (error) {
    console.error('Error generating learning path:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate learning path. Please try again.' },
      { status: 500 }
    );
  }
}
