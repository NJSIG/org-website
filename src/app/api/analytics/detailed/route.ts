import { getPlausibleData } from '@/lib/plausible';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload, PayloadRequest } from 'payload';

/**
 * Fetch detailed analytics data from Plausible based on the specified period.
 * NOTE: Role-based access control is currently commented out but can be enabled as needed.
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    let auth;

    try {
      auth = await payload.auth({
        req: req as unknown as PayloadRequest,
        headers: req.headers,
      });
    } catch (error) {
      payload.logger.error({ err: error }, 'Error verifying token for analytics detail route.');
      return NextResponse.json(
        { error: 'An unexpected error occurred while verifying access rights.' },
        { status: 500 },
      );
    }

    const user = auth?.user;
    // const allowedRoles = new Set(['admin', 'editor']);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // if (!allowedRoles.has(user.role)) {
    //   return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    // }

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
