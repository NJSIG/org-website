import { SubfundPill } from '@/components/SubfundPill';
import { EventCardData } from '../types';
import { EventCardType } from './EventCardType';

export const EventCardTags: React.FC<
  Pick<EventCardData, 'eventType' | 'important' | 'categories'>
> = ({ eventType, important, categories }) => {
  return (
    <div className="flex items-start justify-between gap-2">
      <EventCardType eventType={eventType} important={important} />
      {categories && categories.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap justify-end">
          {categories.map((category) => {
            if (
              typeof category !== 'object' ||
              !category ||
              !category.id ||
              !category.slug ||
              !category.name
            ) {
              return null;
            }

            return (
              <SubfundPill
                key={category.id}
                theme={category.slug}
                label={category.name.toUpperCase()}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
