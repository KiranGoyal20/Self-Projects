import { NextRequest, NextResponse } from 'next/server';
import { parseProtocolText } from '@/lib/engine/protocolParser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText } = body;

    if (!rawText || typeof rawText !== 'string') {
      return NextResponse.json(
        { error: 'Missing rawText in request body' },
        { status: 400 }
      );
    }

    const criteria = parseProtocolText(rawText);

    return NextResponse.json({
      success: true,
      extractedCount: criteria.length,
      criteria,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to parse protocol text' },
      { status: 500 }
    );
  }
}
