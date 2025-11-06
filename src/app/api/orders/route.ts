import { NextRequest, NextResponse } from 'next/server';
import { esimGoService } from '@/lib/esim-go';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bundleName, quantity = 1, iccid, profileID } = body;

    if (!bundleName) {
      return NextResponse.json(
        { error: 'Bundle name is required' },
        { status: 400 }
      );
    }

    // Create the actual order
    const order = await esimGoService.createOrder({
      quantity,
      item: bundleName,
      assign: true,
      iccid: iccid || '',
      profileID,
    });

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get account balance for dashboard
    const balance = await esimGoService.getAccountBalance();
    
    return NextResponse.json({
      balance,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching account info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account information' },
      { status: 500 }
    );
  }
}