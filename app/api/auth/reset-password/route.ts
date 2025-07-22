import { NextRequest, NextResponse } from 'next/server';
import { resetCodes } from '../../resetCodes';
import { hashPassword } from '@/lib/auth';
import { getUsers } from '@/lib/database';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();
    
    // Normalize inputs
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    const normalizedCode = code ? code.trim() : '';
    
    console.log('🔐 Resetting password for:', normalizedEmail, 'Code:', normalizedCode);

    if (!normalizedEmail || !normalizedCode || !newPassword) {
      return NextResponse.json({ error: 'Email, code, and new password are required' }, { status: 400 });
    }

    const storedData = resetCodes.get(normalizedEmail);
    console.log('📦 Stored data for password reset:', storedData);

    if (!storedData) {
      console.log('❌ No stored code found for password reset, email:', normalizedEmail);
      resetCodes.debug();
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }

    // Check if code has expired
    if (Date.now() > storedData.expires) {
      console.log('⏰ Code expired for password reset, email:', normalizedEmail);
      resetCodes.delete(normalizedEmail);
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // Check if code matches
    if (storedData.code !== normalizedCode) {
      console.log('🚫 Code mismatch for password reset, email:', normalizedEmail, 'Expected:', storedData.code, 'Got:', normalizedCode);
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Validate password strength (basic validation)
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Update the password in the database
    try {
      const usersFile = join(process.cwd(), 'data', 'users.json');
      const usersData = JSON.parse(require('fs').readFileSync(usersFile, 'utf8'));
      const userIndex = usersData.findIndex((u: any) => u.email === normalizedEmail);
      
      if (userIndex === -1) {
        console.log('❌ User not found for password reset:', normalizedEmail);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Hash the new password
      const hashedPassword = hashPassword(newPassword);
      
      // Update the user's password
      usersData[userIndex] = {
        ...usersData[userIndex],
        password: hashedPassword
      };

      // Save back to file
      writeFileSync(usersFile, JSON.stringify(usersData, null, 2));
      
      console.log(`✅ Password updated successfully for ${normalizedEmail}`);
      
    } catch (dbError) {
      console.error('Database error during password reset:', dbError);
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    // Clean up the verification code
    resetCodes.delete(normalizedEmail);

    return NextResponse.json({ 
      message: 'Password reset successfully',
      email: normalizedEmail 
    }, { status: 200 });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
