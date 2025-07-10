import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { LearningPath } from '@/types';
// Temporarily comment out this import to test if it's causing issues
// import { validateResourceUrl, getCuratedResources, RELIABLE_RESOURCE_DOMAINS } from '@/lib/resources';

export async function POST(request: NextRequest) {
  console.log('=== API Route Called ===');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    console.log('Checking API key...');
    // Check for API key first
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please check environment variables.' },
        { status: 500 }
      );
    }

    console.log('API key exists, length:', process.env.OPENAI_API_KEY.length);
    console.log('API key prefix:', process.env.OPENAI_API_KEY.substring(0, 7) + '...');

    console.log('Parsing request body...');
    const { topic, difficulty, timeCommitment, priorExperience } = await request.json();
    console.log('Request data:', { topic, difficulty, timeCommitment, priorExperience });

    if (!topic) {
      console.log('Topic validation failed');
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    console.log('Initializing OpenAI client...');
    // Initialize OpenAI client inside the function
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized successfully');

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

    console.log('Making OpenAI API call...');
    console.log('Using model: gpt-4o-mini');
    console.log('Prompt length:', prompt.length);
    
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

    console.log('OpenAI API call successful');
    console.log('Response length:', completion.choices[0].message.content?.length || 0);
    console.log('Model used:', completion.model);
    console.log('Usage:', completion.usage);

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
    // Temporarily disable resource validation to test
    // const curatedResources = getCuratedResources(topic, difficulty);
    
    learningPath.stages = learningPath.stages.map((stage, stageIndex) => {
      // Simple validation - just check if URL exists
      const validResources = stage.resources.filter(resource => 
        resource.url && resource.url.startsWith('http')
      );
      
      // If no valid resources, add a fallback
      if (validResources.length === 0) {
        validResources.push({
          title: "Search for resources on this topic",
          url: `https://www.google.com/search?q=${encodeURIComponent(stage.title + ' tutorial')}`,
          type: "article" as const,
          duration: "Variable"
        });
      }
      
      return {
        ...stage,
        resources: validResources
      };
    });

    return NextResponse.json(learningPath);

  } catch (error: any) {
    console.error('=== ERROR in API Route ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error type field:', error.type);
    console.error('Error status:', error.status);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    console.error('Error stack:', error.stack);
    
    // Check for missing API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please check environment variables.' },
        { status: 500 }
      );
    }
    
    // Check for API key related errors
    if (error.code === 'invalid_api_key' || error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your API key configuration.' },
        { status: 401 }
      );
    }
    
    // Check for rate limit errors
    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'OpenAI rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }
    
    // Check for quota/billing errors
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI quota exceeded. Please check your OpenAI billing.' },
        { status: 402 }
      );
    }

    // Check for model access errors
    if (error.code === 'model_not_found' || error.message?.includes('model')) {
      return NextResponse.json(
        { error: 'Model access issue. Your API key may not have access to this model.' },
        { status: 403 }
      );
    }

    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: 'Failed to generate learning path. Please try again.',
        details: error.message,
        errorCode: error.code,
        errorType: error.type
      },
      { status: 500 }
    );
  }
}
