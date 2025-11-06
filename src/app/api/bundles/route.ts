import { NextRequest, NextResponse } from 'next/server';
import { esimGoService } from '@/lib/esim-go';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const perPage = searchParams.get('perPage') ? parseInt(searchParams.get('perPage')!) : 50;
    const countries = searchParams.get('countries') || undefined;
    const region = searchParams.get('region') || undefined;
    const group = searchParams.get('group') || undefined;

    const response = await esimGoService.getCatalogue({
      page,
      perPage,
      countries,
      region,
      group,
    });

    // The API returns { bundles: [...] } format, so we need to extract just the bundles
    const bundles = response.bundles || response;

    return NextResponse.json(bundles);
  } catch (error) {
    console.error('Error fetching bundles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bundles' },
      { status: 500 }
    );
  }
}