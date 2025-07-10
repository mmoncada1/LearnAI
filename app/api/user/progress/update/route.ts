import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { updateLearningPathProgress } from '@/lib/database';

export async function PATCH(request: NextRequest) {
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

    const { pathId, stageIndex, resourceIndex, completed } = await request.json();
    
    if (!pathId || stageIndex === undefined || resourceIndex === undefined || completed === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    updateLearningPathProgress(decoded.id, pathId, stageIndex, resourceIndex, completed);

    return NextResponse.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
