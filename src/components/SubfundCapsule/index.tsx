import { Subfund } from '@/payload-types';
import coolifyImageLoader from '@/utilities/coolifyImageLoader';
import { ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ContactPerson } from '../ContactPerson';
import { RichText } from '../RichText';

type SubfundCapsuleProps = {
  subfund: Subfund;
};

export const SubfundCapsule: React.FC<SubfundCapsuleProps> = ({ subfund }) => {
  return (
    <Link
      href={`/sub-funds/${subfund.slug}`}
      data-subfund-theme={subfund.theme}
      className="subfund-theme flex flex-col gap-4 p-6 rounded-3xl bg-(--subfund-capsule-bg) group/capsule w-full max-w-section hover:bg-mix-shade-(--subfund-capsule-bg)/2 transition-colors relative min-h-72"
    >
      <div className="flex items-center justify-between w-full pb-2 border-b-[6px] border-(--subfund-accent)">
        <h3 className="text-5xl font-extrabold text-(--subfund-foreground)">{subfund.shortName}</h3>
        <ArrowUpRightIcon
          size="40"
          className="group-hover/capsule:motion-safe:animate-micro-up-right stroke-(--subfund-foreground)"
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

              return <ContactPerson key={admin.id} contact={admin} size="sm" />;
            })}
          </div>
        )}
        {subfund.content.reps && (
          <div className="flex flex-col gap-2">
            {subfund.content.reps.map((rep) => {
              if (typeof rep === 'string') {
                return null;
              }

              return <ContactPerson key={rep.id} contact={rep} size="sm" />;
            })}
          </div>
        )}
      </div>
      <Image
        className="hidden md:block absolute right-16 top-8 w-40 h-auto"
        src={`/assets/sub-funds/${subfund.theme}-map.svg`}
        alt={`${subfund.shortName} Map`}
        height={0}
        width={0}
        unoptimized
        loader={coolifyImageLoader}
      />
    </Link>
  );
};
