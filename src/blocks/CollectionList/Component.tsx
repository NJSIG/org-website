import { CollectionListBlock as BaseCollectionListBlockProps } from '@/payload-types';
import { CollectionListContacts } from './components/CollectionListContacts/Component';
import { CollectionListEvents } from './components/CollectionListEvents/Component';
import { CollectionListLegalNotices } from './components/CollectionListLegalNotices/Component';
import { ListableCollections } from './config';

type CollectionListBlockProps = BaseCollectionListBlockProps & {
  searchParams?: Record<string, string | string[] | undefined>;
};

export const CollectionListBlock: React.FC<CollectionListBlockProps> = ({
  listableCollection,
  searchParams,
  ...filters
}) => {
  switch (listableCollection) {
    case ListableCollections.Contacts.value:
      return <CollectionListContacts filters={filters.contactFilters} />;
    case ListableCollections.Events.value:
      return <CollectionListEvents filters={filters.eventFilters} searchParams={searchParams} />;
    case ListableCollections.LegalNotices.value:
      return (
        <CollectionListLegalNotices
          filters={filters.legalNoticeFilters}
          searchParams={searchParams}
        />
      );
    default:
      return null;
  }
};
