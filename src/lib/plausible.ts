import { z } from 'zod';

// We're using snake case in our Zod schemas to match the API response from Plausible, this way we can directly
// infer the types without needing to do any transformations on the data, we can just use the parsed response as is.

const TimePeriodSchema = z.object({
  date: z.string(),
  visitors: z.number(),
  pageviews: z.number().optional(),
  bounce_rate: z.number().optional(),
  visit_duration: z.number().optional(),
});

const PageSchema = z.object({
  page: z.string(),
  visitors: z.number(),
  pageviews: z.number(),
  bounce_rate: z.number(),
  visit_duration: z.number(),
});

const SourceSchema = z.object({
  source: z.string(),
  visitors: z.number(),
  bounce_rate: z.number(),
  visit_duration: z.number(),
});

const EventSchema = z.object({
  goal: z.string(),
  visitors: z.number(),
  events: z.number(),
  conversion_rate: z.number(),
});

const StatsSchema = z.object({
  results: z
    .object({
      visitors: z
        .object({
          value: z.number(),
          change: z.number().nullable().optional(),
        })
        .optional(),
      pageviews: z
        .object({
          value: z.number(),
          change: z.number().nullable().optional(),
        })
        .optional(),
      bounce_rate: z
        .object({
          value: z.number(),
          change: z.number().nullable().optional(),
        })
        .optional(),
      visit_duration: z
        .object({
          value: z.number(),
          change: z.number().nullable().optional(),
        })
        .optional(),
    })
    .optional(),
});

const RealtimeSchema = z.number();

export type TimePeriodData = z.infer<typeof TimePeriodSchema>;
export type PageData = z.infer<typeof PageSchema>;
export type SourceData = z.infer<typeof SourceSchema>;
export type EventData = z.infer<typeof EventSchema>;
export type StatsData = {
  visitors: { value: number; change: number | null };
  pageviews: { value: number; change: number | null };
  bounce_rate: { value: number; change: number | null };
  visit_duration: { value: number; change: number | null };
};

export interface PlausibleData {
  stats: StatsData;
  timeseries: TimePeriodData[];
  pages: PageData[];
  sources: SourceData[];
  events: EventData[];
  realtime: { visitors: number };
}

function getPlausibleConfig() {
  return {
    apiKey: process.env.PLAUSIBLE_API_KEY,
    siteId: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    apiHost: process.env.PLAUSIBLE_API_HOST || process.env.NEXT_PUBLIC_PLAUSIBLE_HOST,
  };
}

async function fetchPlausibleAPI<T>(
  endpoint: string,
  params: Record<string, string> = {},
  schema: z.ZodSchema<T>,
): Promise<T | null> {
  const config = getPlausibleConfig();
  const { apiKey, siteId, apiHost } = config;

  try {
    if (!apiKey || !siteId || !apiHost) {
      throw new Error('Configuration Error');
    }

    const queryParams = new URLSearchParams({
      site_id: siteId,
      ...params,
    });

    const url = new URL(`/api/v1/stats/${endpoint}?${queryParams}`, apiHost).toString();
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return schema.parse(data);
  } catch (e) {
    console.error('Error fetching Plausible data:', e);
    return null;
  }
}

export async function getPlausibleData(period: string = '7d'): Promise<PlausibleData | null> {
  try {
    const [statsResponse, timeseries, pages, sources, events, realtime] = await Promise.all([
      fetchPlausibleAPI(
        'aggregate',
        {
          period,
          metrics: 'visitors,pageviews,bounce_rate,visit_duration',
          compare: 'previous_period',
        },
        StatsSchema,
      ),

      fetchPlausibleAPI(
        'timeseries',
        { period, metrics: 'visitors' },
        z.object({ results: z.array(TimePeriodSchema) }),
      ).then((res) => res?.results || []),

      fetchPlausibleAPI(
        'breakdown',
        {
          period,
          property: 'event:page',
          limit: '10',
          metrics: 'visitors,pageviews,bounce_rate,visit_duration',
        },
        z.object({ results: z.array(PageSchema) }),
      ).then((res) => res?.results || []),

      fetchPlausibleAPI(
        'breakdown',
        {
          period,
          property: 'visit:source',
          limit: '10',
          metrics: 'visitors,bounce_rate,visit_duration',
        },
        z.object({ results: z.array(SourceSchema) }),
      ).then((res) => res?.results || []),

      fetchPlausibleAPI(
        'breakdown',
        {
          period,
          property: 'event:goal',
          limit: '10',
          metrics: 'visitors,events,conversion_rate',
        },
        z.object({ results: z.array(EventSchema) }),
      )
        .then((res) => res?.results || [])
        .catch((e) => {
          console.warn('Failed to fetch events', e);
          return [];
        }),

      fetchPlausibleAPI('realtime/visitors', {}, RealtimeSchema)
        .then((res) => ({ visitors: res || 0 }))
        .catch(() => ({ visitors: 0 })),
    ]);

    if (!statsResponse?.results) {
      return null;
    }

    const stats: StatsData = {
      visitors: {
        value: statsResponse.results.visitors?.value || 0,
        change: statsResponse.results.visitors?.change ?? null,
      },
      pageviews: {
        value: statsResponse.results.pageviews?.value || 0,
        change: statsResponse.results.pageviews?.change ?? null,
      },
      bounce_rate: {
        value: statsResponse.results.bounce_rate?.value || 0,
        change: statsResponse.results.bounce_rate?.change ?? null,
      },
      visit_duration: {
        value: statsResponse.results.visit_duration?.value || 0,
        change: statsResponse.results.visit_duration?.change ?? null,
      },
    };

    return {
      stats,
      timeseries: timeseries as TimePeriodData[],
      pages: pages as PageData[],
      sources: sources as SourceData[],
      events: events as EventData[],
      realtime: realtime || { visitors: 0 },
    };
  } catch (e) {
    console.error('Error fetching Plausible data:', e);
    return null;
  }
}

/**
 * Format a number into a more readable string with K/M suffixes.
 * @param num
 * @returns
 */
export function formatNumber(num: number | unknown): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return 'NaN';
  }

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }

  if (num > 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }

  return num.toString();
}

/**
 * Format duration given in seconds to a more readable string with minutes and seconds.
 * @param seconds
 * @returns
 */
export function formatDuration(seconds: number | unknown): string {
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    return 'NaN';
  }

  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

/**
 * Format a number as a percentage string.
 * @param value
 * @returns
 */
export function formatPercentage(value: number | unknown): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'NaN';
  }

  return `${Math.round(value)}%`;
}

/**
 * Format change value into text with sign and determine if it's positive.
 * @param change
 * @returns
 */
export function formatChange(change: number | null): { text: string; isPositive: boolean } {
  if (change === null) {
    return { text: 'N/A', isPositive: false };
  }

  if (change === 0) {
    return { text: '0%', isPositive: false };
  }

  const isPositive = change > 0;
  const text = `${isPositive ? '+' : ''}${Math.round(change)}%`;

  return { text, isPositive };
}
