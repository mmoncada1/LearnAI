import { NextRequest, NextResponse } from 'next/server';
import { RegisterRequest, User } from '@/types';
import { hashPassword, validateEmail, validatePassword, generateUserId, createAuthResponse } from '@/lib/auth';
import { getUserByEmail, saveUser, saveUserProgress } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password }: RegisterRequest = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const hashedPassword = hashPassword(password);
    const newUser: User & { password: string } = {
      id: generateUserId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    // Save user (without password in the returned object)
    const userToSave = { ...newUser };
    delete (userToSave as any).password;
    saveUser(userToSave);

    // Initialize user progress
    const initialProgress = {
      userId: newUser.id,
      learningPaths: [],
      completedResources: [],
      totalHoursSpent: 0,
      skillsLearned: [],
      streakDays: 0,
      lastActivityAt: new Date().toISOString()
    };
    saveUserProgress(initialProgress);

    // Create auth response
    const authResponse = createAuthResponse(userToSave);

    return NextResponse.json(authResponse, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
