import { CollectionListBlock as CollectionListBlockProps } from '@/payload-types';
import { CollectionListContacts } from './components/CollectionListContacts/Component';

export const CollectionListBlock: React.FC<CollectionListBlockProps> = ({
  listableCollection,
  ...filters
}) => {
  switch (listableCollection) {
    case 'contacts':
      return <CollectionListContacts filters={filters.contactFilters} />;
    default:
      return null;
  }
};
