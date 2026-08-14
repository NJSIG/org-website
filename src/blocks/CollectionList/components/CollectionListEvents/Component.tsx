import { CollectionListBlock } from '@/payload-types';
import { CollectionListEventsClient } from './Component.client';
import { queryEvents } from './actions';

export type CollectionListEventsProps = {
  filters: CollectionListBlock['eventFilters'];
};

export const CollectionListEvents: React.FC<CollectionListEventsProps> = async ({ filters }) => {
  const events = await queryEvents({ filters });

  async function fetchPage({ page, perPage }: { page: number; perPage: number }) {
    'use server';

    return queryEvents({ filters, page, perPage });
  }

  return <CollectionListEventsClient filters={filters} events={events} fetchPage={fetchPage} />;
};
