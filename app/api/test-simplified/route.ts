import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('=== SIMPLIFIED API Route Called ===');
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
    const { topic, difficulty } = await request.json();
    console.log('Request data:', { topic, difficulty });

    if (!topic) {
      console.log('Topic validation failed');
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    console.log('About to import OpenAI...');
    
    // Dynamic import to see if this is the issue
    const { default: OpenAI } = await import('openai');
    console.log('OpenAI imported successfully');

    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized successfully');

    console.log('Making OpenAI API call...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Create a simple learning path for ${topic} at ${difficulty} level. Respond with JSON only.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log('OpenAI API call successful');
    console.log('Response length:', completion.choices[0].message.content?.length || 0);

    // Return a simplified response
    return NextResponse.json({
      topic,
      difficulty,
      description: `Learning path for ${topic}`,
      stages: [
        {
          title: "Getting Started",
          description: "Introduction to the basics",
          resources: [
            {
              title: "Basic Tutorial",
              url: "https://www.w3schools.com",
              type: "article",
              duration: "2 hours"
            }
          ]
        }
      ]
    });

  } catch (error: any) {
    console.error('=== ERROR in Simplified API Route ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: 'Simplified API failed',
        details: error.message,
        errorCode: error.code,
        errorType: error.type,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
