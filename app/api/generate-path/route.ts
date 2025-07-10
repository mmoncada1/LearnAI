import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { LearningPath } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
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
          "url": "actual working URL",
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
- Use actual URLs from reputable sources (YouTube, freeCodeCamp, MDN, Coursera, etc.)
- Make it progressive - each stage builds on the previous
- Include hands-on practice opportunities
- Be specific and actionable

Focus on creating a realistic, achievable learning path with genuine, helpful resources.`;

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
