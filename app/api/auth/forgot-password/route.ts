import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { resetCodes } from '../../resetCodes';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Generate a 6-digit code
    const code = generateResetCode();
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    // Store the code with normalized email
    resetCodes.set(normalizedEmail, { code, expires });
    
    // Debug the storage
    resetCodes.debug();

    // Send email with verification code
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'SkillMapAI <onboarding@resend.dev>',
        to: [normalizedEmail],
        subject: 'Your SkillMapAI Password Reset Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset Code</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p>You requested a password reset for your SkillMapAI account.</p>
              <p>Your verification code is:</p>
              <div style="background: #f3f4f6; border: 2px dashed #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 4px; font-family: monospace; margin: 0;">${code}</h1>
              </div>
              <p><strong>This code will expire in 15 minutes.</strong></p>
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              <p>Best regards,<br>The SkillMapAI Team</p>
            </div>
            <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #6b7280;">
              <p>This is an automated email. Please don't reply to this message.</p>
            </div>
          </div>
        `,
        text: `
Your SkillMapAI Password Reset Code

You requested a password reset for your SkillMapAI account.

Your verification code is: ${code}

This code will expire in 15 minutes.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The SkillMapAI Team
        `
      });

      console.log(`📧 Password reset code sent to ${normalizedEmail}`);
      
      return NextResponse.json({ 
        message: 'If an account with this email exists, a verification code has been sent to your email address.',
        email: normalizedEmail
      }, { status: 200 });
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Don't reveal if the email failed - always return success message for security
      return NextResponse.json({ 
        message: 'If an account with this email exists, a verification code has been sent to your email address.',
        email: normalizedEmail
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Password recovery error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
