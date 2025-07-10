import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('=== DIRECT FETCH API Route Called ===');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    console.log('Checking API key...');
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please check environment variables.' },
        { status: 500 }
      );
    }

    console.log('API key exists, length:', process.env.OPENAI_API_KEY.length);

    console.log('Parsing request body...');
    const { topic, difficulty } = await request.json();
    console.log('Request data:', { topic, difficulty });

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    console.log('Making direct fetch to OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'SkillMapAI/1.0',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert learning path designer. Create a simple learning path with valid JSON only.'
          },
          {
            role: 'user',
            content: `Create a learning path for ${topic} at ${difficulty} level. Return only JSON with this structure: {"topic": "${topic}", "difficulty": "${difficulty}", "description": "Brief description", "stages": [{"title": "Stage 1", "description": "Learn basics", "resources": [{"title": "Basic Tutorial", "url": "https://www.w3schools.com", "type": "article", "duration": "2 hours"}]}]}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log('OpenAI response status:', response.status);
    console.log('OpenAI response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return NextResponse.json(
        { error: 'OpenAI API request failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('OpenAI response received, length:', JSON.stringify(data).length);

    const content = data.choices[0].message.content;
    let learningPath;
    
    try {
      learningPath = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Return a simple fallback if parsing fails
      learningPath = {
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
      };
    }

    console.log('Returning learning path');
    return NextResponse.json(learningPath);

  } catch (error: any) {
    console.error('=== ERROR in Direct Fetch API Route ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Direct fetch failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}
