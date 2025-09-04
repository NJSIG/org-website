import { Subfund } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import { ContactPerson } from '../ContactPerson';
import RichText from '../RichText';

type SubfundCapsuleProps = {
  subfund: Subfund;
};

export const SubfundCapsule: React.FC<SubfundCapsuleProps> = ({ subfund }) => {
  return (
    <Link
      href={`/sub-funds/${subfund.slug}`}
      className={cn(
        `subfund-theme-${subfund.shortName.toLowerCase()}`,
        'flex flex-col gap-4 p-6 rounded-3xl bg-[var(--subfund-capsule-bg)] group/capsule w-full max-w-section',
      )}
    >
      <div className="flex items-center justify-between w-full pb-2 border-b-[6px] border-[var(--subfund-accent)]">
        <h3 className="text-5xl font-extrabold text-[var(--subfund-foreground)]">
          {subfund.shortName}
        </h3>
        <ArrowUpRightIcon
          size="40"
          className="group-hover/capsule:motion-safe:animate-micro-up-right stroke-[var(--subfund-foreground)]"
        />
      </div>
      <RichText data={subfund.content.summary} className="prose-base mx-0 max-w-section-content" />
      <div className="flex flex-col gap-4 md:flex-row">
        {subfund.content.administrators && (
          <div className="flex flex-col gap-2">
            {subfund.content.administrators.map((admin) => {
              if (typeof admin === 'string') {
                return null;
              }

              return <ContactPerson key={admin.id} contact={admin} />;
            })}
          </div>
        )}
        {subfund.content.reps && (
          <div className="flex flex-col gap-2">
            {subfund.content.reps.map((rep) => {
              if (typeof rep === 'string') {
                return null;
              }

              return <ContactPerson key={rep.id} contact={rep} />;
            })}
          </div>
        )}
      </div>
    </Link>
  );
};
