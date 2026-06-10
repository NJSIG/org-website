import { CollectionListBlock } from '@/payload-types';
import { CollectionListEventsClient } from './Component.client';
import { queryEvents } from './actions';

export type CollectionListEventsProps = {
  filters: CollectionListBlock['eventFilters'];
  searchParams?: Record<string, string | string[] | undefined>;
};

export const CollectionListEvents: React.FC<CollectionListEventsProps> = async ({
  filters,
  searchParams,
}) => {
  const events = await queryEvents({ filters, searchParams });

  console.log('CollectionListEvents filters:', filters);
  console.log('CollectionListEvents searchParams:', searchParams);

  return (
    <CollectionListEventsClient filters={filters} searchParams={searchParams} events={events} />
  );
};
