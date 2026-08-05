import Bento from '@/components/Bento';
import { RichText } from '@/components/RichText';
import type { Event } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { hasText } from '@payloadcms/richtext-lexical/shared';
import styles from './grid.module.css';

type ImportantEventGridProps = {
  description: Event['description'];
  formattedStartDate: string;
  formattedStartTime: string;
};

export const ImportantEventGrid: React.FC<ImportantEventGridProps> = ({
  description,
  formattedStartDate,
  formattedStartTime,
}) => {
  const hasDescription = hasText(description);

  if (hasDescription) {
    return (
      <Bento
        className={cn(
          styles.details,
          [styles['details--with-description']],
          'auto-rows-auto [grid-template-areas:var(--grid-sm)] lg:gap-y-0 lg:[grid-template-areas:var(--grid-lg)]',
        )}
      >
        {/* Description */}
        <Bento.Item icon="book-open-text" label="Description" className="[grid-area:description]">
          <RichText data={description} className="mx-0" />
        </Bento.Item>

        {/* Datetime */}
        <div className="details__datetime-column flex h-full flex-col [grid-area:datetime]">
          <div className="details__datetime-row flex h-full flex-col gap-4 md:max-h-24 md:flex-row">
            {/* Date */}
            <Bento.Item icon="calendar" label="Date" className="flex grow flex-col">
              <div className="flex grow flex-col justify-center gap-1 text-[clamp(20px,1vw,24px)] font-medium">
                <span>{formattedStartDate}</span>
              </div>
            </Bento.Item>

            {/* Time */}
            <Bento.Item icon="clock" label="Time" className="flex grow flex-col">
              <div className="flex grow flex-col justify-center gap-1 text-[clamp(20px,1vw,24px)] font-medium">
                <span>{formattedStartTime}</span>
              </div>
            </Bento.Item>
          </div>

          {/* Placeholder */}
          <div className="hidden md:flex md:h-(--placeholder-container-height) md:items-end">
            <Bento.Placeholder className="details__placeholder w-full md:h-(--placeholder-height)" />
          </div>
        </div>
      </Bento>
    );
  }

  return (
    <Bento
      className={cn(
        styles.details,
        '[grid-template-areas:var(--grid-sm)] md:[grid-template-areas:var(--grid-md)] lg:[grid-template-areas:var(--grid-lg)]',
      )}
    >
      {/* Date */}
      <Bento.Item icon="calendar" label="Date" className="flex flex-col [grid-area:date]">
        <div className="flex grow flex-col justify-center gap-1 text-[clamp(18px,6vw,24px)] font-medium">
          <span>{formattedStartDate}</span>
        </div>
      </Bento.Item>

      {/* Time */}
      <Bento.Item icon="clock" label="Time" className="flex flex-col [grid-area:time]">
        <div className="flex grow flex-col justify-center gap-1 text-[clamp(18px,6vw,24px)] font-medium">
          <span>{formattedStartTime}</span>
        </div>
      </Bento.Item>

      {/* Placeholder */}
      <Bento.Placeholder className="hidden [grid-area:placeholder] lg:block" />
    </Bento>
  );
};
