import { NextRequest, NextResponse } from 'next/server';
import { ESIMUsage } from '@/types';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const data: ESIMUsage = JSON.parse(body);

    // Verify HMAC signature if configured
    const signature = request.headers.get('x-signature');
    const webhookSecret = process.env.WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('base64');
        
      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Process the usage update
    console.log('eSIM Usage Update:', {
      iccid: data.iccid,
      alertType: data.alertType,
      bundle: {
        name: data.bundle.name,
        remainingQuantity: data.bundle.remainingQuantity,
        initialQuantity: data.bundle.initialQuantity
      }
    });

    // Here you could:
    // 1. Update your database with usage information
    // 2. Send notifications to users about low data
    // 3. Trigger refill options
    // 4. Update analytics

    // Example: Check if data is running low
    const usagePercentage = (data.bundle.initialQuantity - data.bundle.remainingQuantity) / data.bundle.initialQuantity;
    
    if (usagePercentage >= 0.8) {
      console.log(`⚠️  Data plan ${data.bundle.name} is 80% used for ICCID ${data.iccid}`);
      // Could trigger email notification or push notification here
    }

    if (data.alertType === 'depleted') {
      console.log(`🔴 Data plan ${data.bundle.name} is fully depleted for ICCID ${data.iccid}`);
      // Could trigger automatic refill or upsell notification
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      processed: {
        iccid: data.iccid,
        bundleName: data.bundle.name,
        remainingQuantity: data.bundle.remainingQuantity,
        usagePercentage: Math.round(usagePercentage * 100)
      }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-signature',
    },
  });
}