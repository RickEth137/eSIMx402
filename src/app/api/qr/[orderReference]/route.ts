import { NextRequest, NextResponse } from 'next/server';
import { esimGoService } from '@/lib/esim-go';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderReference: string } }
) {
  try {
    const { orderReference } = params;

    if (!orderReference) {
      return NextResponse.json(
        { error: 'Order reference is required' },
        { status: 400 }
      );
    }

    // Get QR code as ZIP file
    const qrCodeData = await esimGoService.getQRCode(orderReference);

    // Convert ArrayBuffer to Buffer for Next.js response
    const buffer = Buffer.from(qrCodeData);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="esim-${orderReference}.zip"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR code' },
      { status: 500 }
    );
  }
}