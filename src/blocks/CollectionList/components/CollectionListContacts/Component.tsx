import Bento from '@/components/Bento';
import { ContactPerson, ContactPersonPortraitOptions } from '@/components/ContactPerson';
import { CollectionListBlock } from '@/payload-types';
import { cn } from '@/utilities/cn';

export type CollectionListContactsProps = {
  filters: CollectionListBlock['contactFilters'];
};

export const CollectionListContacts: React.FC<CollectionListContactsProps> = ({ filters }) => {
  if (!filters) {
    return null;
  }

  const { contacts, columns, squareGrid } = filters;

  if (!contacts || contacts.length === 0) {
    return null;
  }

  const emptySlots =
    columns === '3' ? (3 - (contacts.length % 3)) % 3 : (2 - (contacts.length % 2)) % 2;

  return (
    <Bento
      className={cn('grid-cols-1 md:grid-cols-2', {
        'lg:grid-cols-3': columns === '3',
      })}
    >
      {contacts.map((contact) => {
        if (typeof contact === 'string') {
          return null; // Skip if the contact is just an ID string
        }

        return (
          <Bento.Generic key={contact.id} className="flex items-center">
            <ContactPerson
              contact={contact}
              showPortrait={filters.showPortraits as ContactPersonPortraitOptions}
              className="items-start"
            />
          </Bento.Generic>
        );
      })}
      {squareGrid && emptySlots > 0 && (
        <Bento.Placeholder
          className={cn('hidden', {
            'md:block': emptySlots === 1,
            'lg:block lg:col-span-2': emptySlots === 2,
          })}
        />
      )}
    </Bento>
  );
};
