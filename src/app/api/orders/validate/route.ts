import { NextRequest, NextResponse } from 'next/server';
import { esimGoService } from '@/lib/esim-go';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bundleName, quantity = 1, iccid } = body;

    if (!bundleName) {
      return NextResponse.json(
        { error: 'Bundle name is required' },
        { status: 400 }
      );
    }

    // First validate the order
    const validation = await esimGoService.validateOrder({
      quantity,
      item: bundleName,
      assign: true,
      iccid: iccid || '',
    });

    if (!validation) {
      return NextResponse.json(
        { error: 'Order validation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      validation,
      message: 'Order validated successfully',
    });
  } catch (error) {
    console.error('Error validating order:', error);
    return NextResponse.json(
      { error: 'Failed to validate order' },
      { status: 500 }
    );
  }
}