import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import { cache } from 'react';

type Args = {
  params: Promise<{ slug?: string[] }>;
};

const queryEventByDateAndSlug = cache(async ({ slug }: { slug: string[] }) => {
  if (!slug || slug.length < 4) {
    return null; // Invalid slug format
  }

  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config: configPromise });

  const startDate = new Date(`${slug[0]}-${slug[1]}-${slug[2]}`);

  console.log('Querying event for date:', startDate, 'and slug:', slug[3]);

  const result = await payload.find({
    collection: 'events',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      startDate: {
        greater_than_equal: startDate.toISOString(),
      },
      slug: {
        equals: slug[3],
      },
    },
  });

  return result.docs?.[0] || null;
});

export default async function EventPage({ params: paramsPromise }: Args) {
  const { slug = [] } = await paramsPromise;
  const event = await queryEventByDateAndSlug({ slug });

  console.log('Event Data', event);

  return (
    <article className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Event Page</h1>
      <p className="mt-4">This page will display details for a specific event.</p>
      <pre className="mt-4 max-w-5xl font-mono">{JSON.stringify(event)}</pre>
    </article>
  );
}
