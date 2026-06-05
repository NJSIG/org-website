import Bento from '@/components/Bento';
import { ContactPerson } from '@/components/ContactPerson';
import { ContactListBlock as ContactListBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';

export const ContactListBlock: React.FC<ContactListBlockProps> = ({
  board,
  columns,
  squareGrid,
}) => {
  if (!board || board?.length === 0) {
    return null;
  }

  const emptySlots = columns === '3' ? (3 - (board.length % 3)) % 3 : (2 - (board.length % 2)) % 2;

  return (
    <Bento
      className={cn('grid-cols-1 md:grid-cols-2', {
        'lg:grid-cols-3': columns === '3',
      })}
    >
      {board.map((contact) => {
        if (typeof contact === 'string') {
          return null; // Skip if the contact is just an ID string
        }

        return (
          <Bento.Generic key={contact.id} className="flex items-center">
            <ContactPerson contact={contact} className="items-start" />
          </Bento.Generic>
        );
      })}
      {squareGrid && emptySlots > 0 && (
        <Bento.Placeholder className={cn({ 'col-span-2': emptySlots === 2 })} />
      )}
    </Bento>
  );
};
