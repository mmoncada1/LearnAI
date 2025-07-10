import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserProgress, addLearningPathToUser } from '@/lib/database';
import { LearningPath } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const progress = getUserProgress(decoded.id);
    
    if (!progress) {
      // Return empty progress if none exists
      return NextResponse.json({
        userId: decoded.id,
        learningPaths: [],
        completedResources: [],
        totalHoursSpent: 0,
        skillsLearned: [],
        streakDays: 0,
        lastActivityAt: new Date().toISOString()
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const learningPath: LearningPath = await request.json();
    
    if (!learningPath.topic || !learningPath.stages) {
      return NextResponse.json(
        { error: 'Invalid learning path data' },
        { status: 400 }
      );
    }

    addLearningPathToUser(decoded.id, learningPath);

    return NextResponse.json({ message: 'Learning path added successfully' });
  } catch (error) {
    console.error('Error adding learning path:', error);
    return NextResponse.json(
      { error: 'Failed to add learning path' },
      { status: 500 }
    );
  }
}
