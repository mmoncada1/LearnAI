import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest } from '@/types';
import { comparePasswords, createAuthResponse } from '@/lib/auth';
import { getUserByEmail, saveUser } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequest = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get user with password for comparison
    const fs = require('fs');
    const path = require('path');
    const usersFile = path.join(process.cwd(), 'data', 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const userWithPassword = usersData.find((u: any) => u.id === user.id);

    if (!userWithPassword || !comparePasswords(password, userWithPassword.password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login time
    const updatedUser = {
      ...user,
      lastLoginAt: new Date().toISOString()
    };
    
    // Update user in database (with password)
    const userToUpdate = { ...updatedUser, password: userWithPassword.password };
    const allUsers = usersData.map((u: any) => u.id === user.id ? userToUpdate : u);
    fs.writeFileSync(usersFile, JSON.stringify(allUsers, null, 2));

    // Create auth response (without password)
    const authResponse = createAuthResponse(updatedUser);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
