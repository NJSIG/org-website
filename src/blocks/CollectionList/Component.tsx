import { CollectionListBlock as BaseCollectionListBlockProps } from '@/payload-types';
import { CollectionListContacts } from './components/CollectionListContacts/Component';
import { CollectionListEvents } from './components/CollectionListEvents/Component';

type CollectionListBlockProps = BaseCollectionListBlockProps & {
  searchParams?: Record<string, string | string[] | undefined>;
};

export const CollectionListBlock: React.FC<CollectionListBlockProps> = ({
  listableCollection,
  searchParams,
  ...filters
}) => {
  console.log('CollectionListBlock searchParams:', searchParams);

  switch (listableCollection) {
    case 'contacts':
      return <CollectionListContacts filters={filters.contactFilters} />;
    case 'events':
      return <CollectionListEvents filters={filters.eventFilters} searchParams={searchParams} />;
    default:
      return null;
  }
};
