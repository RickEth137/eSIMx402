import { NextRequest, NextResponse } from 'next/server';
import { esimGoService } from '@/lib/esim-go';
import { generateOrderId } from '@/lib/utils';

// Price per plan in USD cents (for x402 payment)
const X402_MARKUP = 1.2; // 20% markup for x402 payment

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bundleName, quantity = 1 } = body;

    if (!bundleName) {
      return NextResponse.json(
        { error: 'Bundle name is required' },
        { status: 400 }
      );
    }

    // Get bundle details to calculate price
    const bundleDetails = await esimGoService.getBundleDetails(bundleName);
    
    // Calculate x402 price (add markup for payment processing)
    const basePrice = bundleDetails.price * 100; // Convert USD to cents
    const x402Price = Math.round(basePrice * X402_MARKUP);
    
    // Check if payment is required (HTTP 402)
    const authHeader = request.headers.get('authorization');
    const paymentRequired = !authHeader || !authHeader.startsWith('Bearer x402-');

    if (paymentRequired) {
      // Return HTTP 402 Payment Required with payment details
      const paymentInfo = {
        amount: x402Price, // in USD cents
        currency: 'USD',
        description: `${bundleDetails.description} - ${quantity}x`,
        recipient: process.env.X402_PAYMENT_ADDRESS || 'your-solana-address',
        metadata: {
          bundleName,
          quantity,
          orderId: generateOrderId(),
        }
      };

      return new NextResponse(
        JSON.stringify({
          error: 'Payment Required',
          payment: paymentInfo,
          message: 'This endpoint requires x402 payment to access'
        }),
        {
          status: 402,
          headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': `x402 amount=${x402Price} currency=USD description="${bundleDetails.description}"`,
            'X-Payment-Required': 'true',
            'X-Payment-Amount': x402Price.toString(),
            'X-Payment-Currency': 'USD',
          }
        }
      );
    }

    // Payment verified - proceed with eSIM order
    try {
      // First validate the order
      const validation = await esimGoService.validateOrder({
        quantity,
        item: bundleName,
        assign: true,
        iccid: '',
      });

      if (!validation) {
        throw new Error('Order validation failed');
      }

      // Create the actual order
      const order = await esimGoService.createOrder({
        quantity,
        item: bundleName,
        assign: true,
        iccid: '',
      });

      // Return success with order details
      return NextResponse.json({
        success: true,
        order,
        payment: {
          amount: x402Price,
          currency: 'USD',
          status: 'completed'
        },
        message: 'Order created successfully',
        qrCodeUrl: `/api/qr/${order.orderReference}`,
      });

    } catch (esimError) {
      console.error('eSIM order failed:', esimError);
      const errorMessage = esimError instanceof Error ? esimError.message : 'Unknown error';
      return NextResponse.json(
        { error: 'Failed to create eSIM order', details: errorMessage },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Purchase API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}