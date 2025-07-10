import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('=== MINIMAL TEST ROUTE ===');
  
  try {
    // Basic environment check
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API key exists:', !!process.env.OPENAI_API_KEY);
    
    // Test request parsing
    const body = await request.json();
    console.log('Request body parsed:', body);
    
    // Test basic response
    return NextResponse.json({
      success: true,
      message: 'Basic route working',
      hasApiKey: !!process.env.OPENAI_API_KEY,
      environment: process.env.NODE_ENV
    });
    
  } catch (error: any) {
    console.error('Minimal test error:', error);
    return NextResponse.json({
      error: 'Minimal test failed',
      details: error.message
    }, { status: 500 });
  }
}
