import { CollectionListBlock as BaseCollectionListBlockProps } from '@/payload-types';
import { CollectionListContacts } from './components/CollectionListContacts/Component';
import { CollectionListEvents } from './components/CollectionListEvents/Component';
import { CollectionListLegalNotices } from './components/CollectionListLegalNotices/Component';
import { ListableCollections } from './config';

type CollectionListBlockProps = BaseCollectionListBlockProps;

export const CollectionListBlock: React.FC<CollectionListBlockProps> = ({
  listableCollection,
  ...filters
}) => {
  switch (listableCollection) {
    case ListableCollections.Contacts.value:
      return <CollectionListContacts filters={filters.contactFilters} />;
    case ListableCollections.Events.value:
      return <CollectionListEvents filters={filters.eventFilters} />;
    case ListableCollections.LegalNotices.value:
      return <CollectionListLegalNotices filters={filters.legalNoticeFilters} />;
    default:
      return null;
  }
};
