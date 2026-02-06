import { getPlausibleData } from '@/lib/plausible';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') || '7d';
    const data = await getPlausibleData(period);

    if (!data) {
      return NextResponse.json({ error: 'Failed to fetch analytics data.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Analytics detail error:', e);

    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching analytics data.' },
      { status: 500 },
    );
  }
}
