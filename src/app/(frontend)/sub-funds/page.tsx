import { LivePreviewListener } from '@/components/LivePreviewListener';
import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import { cache } from 'react';
import SubfundsPageClient from './page.client';

const querySubfunds = cache(async () => {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'subfunds',
    draft,
    pagination: false,
    sort: 'shortName',
  });

  return result.docs || null;
});

export default async function SubfundsPage() {
  const { isEnabled: draft } = await draftMode();
  const subfunds = await querySubfunds();

  return (
    <section>
      <SubfundsPageClient subfunds={subfunds} />
      {draft && <LivePreviewListener />}
    </section>
  );
}
