import Bento from '@/components/Bento';
import { RichText } from '@/components/RichText';
import type { Event } from '@/payload-types';
import { hasText } from '@payloadcms/richtext-lexical/shared';
import './index.css';

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
      <Bento className="auto-rows-auto [grid-template-areas:var(--grid-sm)] lg:[grid-template-areas:var(--grid-lg)] lg:gap-y-0 details--with-description">
        {/* Description */}
        <Bento.Item icon="book-open-text" label="Description" className="[grid-area:description]">
          <RichText data={description} className="mx-0" />
        </Bento.Item>

        {/* Datetime */}
        <div className="[grid-area:datetime] flex flex-col h-full details__datetime-column">
          <div className="details__datetime-row flex flex-col md:flex-row gap-4 h-full md:max-h-24">
            {/* Date */}
            <Bento.Item icon="calendar" label="Date" className="flex flex-col grow">
              <div className="flex flex-col gap-1 grow justify-center font-medium text-[clamp(20px,1vw,24px)]">
                <span>{formattedStartDate}</span>
              </div>
            </Bento.Item>

            {/* Time */}
            <Bento.Item icon="clock" label="Time" className="flex flex-col grow">
              <div className="flex flex-col gap-1 grow justify-center font-medium text-[clamp(20px,1vw,24px)]">
                <span>{formattedStartTime}</span>
              </div>
            </Bento.Item>
          </div>

          {/* Placeholder */}
          <div className="hidden md:flex md:items-end md:h-(--placeholder-container-height)">
            <Bento.Placeholder className="details__placeholder w-full md:h-(--placeholder-height)" />
          </div>
        </div>
      </Bento>
    );
  }

  return (
    <Bento className="[grid-template-areas:var(--grid-sm)] md:[grid-template-areas:var(--grid-md)] lg:[grid-template-areas:var(--grid-lg)]">
      {/* Date */}
      <Bento.Item icon="calendar" label="Date" className="[grid-area:date] flex flex-col">
        <div className="flex flex-col gap-1 grow justify-center font-medium text-[clamp(18px,6vw,24px)]">
          <span>{formattedStartDate}</span>
        </div>
      </Bento.Item>

      {/* Time */}
      <Bento.Item icon="clock" label="Time" className="[grid-area:time] flex flex-col">
        <div className="flex flex-col gap-1 grow justify-center font-medium text-[clamp(18px,6vw,24px)]">
          <span>{formattedStartTime}</span>
        </div>
      </Bento.Item>

      {/* Placeholder */}
      <Bento.Placeholder className="[grid-area:placeholder] hidden lg:block" />
    </Bento>
  );
};
