import { NextRequest, NextResponse } from 'next/server';
import { resetCodes } from '../../resetCodes';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    
    // Clean and normalize inputs
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    const normalizedCode = code ? code.trim() : '';
    
    console.log('🔍 Verifying reset code for:', normalizedEmail, 'Code:', normalizedCode);

    if (!normalizedEmail || !normalizedCode) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const storedData = resetCodes.get(normalizedEmail);
    console.log('📦 Stored data for', normalizedEmail, ':', storedData);
    resetCodes.debug();

    if (!storedData) {
      console.log('❌ No stored code found for email:', normalizedEmail);
      resetCodes.debug();
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }

    // Check if code has expired
    if (Date.now() > storedData.expires) {
      console.log('⏰ Code expired for email:', normalizedEmail);
      resetCodes.delete(normalizedEmail);
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // Check if code matches
    if (storedData.code !== normalizedCode) {
      console.log('🚫 Code mismatch for email:', normalizedEmail, 'Expected:', storedData.code, 'Got:', normalizedCode);
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    console.log('✅ Code verified successfully for email:', normalizedEmail);
    // Code is valid - don't delete it yet, we'll need it for password reset
    return NextResponse.json({ 
      message: 'Verification code is valid',
      email: normalizedEmail 
    }, { status: 200 });

  } catch (error) {
    console.error('Code verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
