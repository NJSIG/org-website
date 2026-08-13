import { Subfund } from '@/payload-types';
import coolifyImageLoader from '@/utilities/coolifyImageLoader';
import { ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type SubfundCapsuleProps = {
  subfund: Subfund;
};

export const SubfundCapsule: React.FC<SubfundCapsuleProps> = ({ subfund }) => {
  return (
    <Link
      href={`/sub-funds/${subfund.slug}`}
      data-subfund-theme={subfund.theme}
      className="subfund-theme group/capsule w-full rounded-3xl bg-(--subfund-capsule-bg) px-6 py-4 transition-colors hover:bg-mix-shade-(--subfund-capsule-bg)/2"
    >
      <div className="-mb-6 flex justify-end">
        <ArrowUpRightIcon
          size="24"
          className="self-start stroke-(--subfund-foreground) group-hover/capsule:motion-safe:animate-micro-up-right"
        />
      </div>
      <div className="relative flex h-29 items-center">
        <div className="w-full border-b-10 border-(--subfund-accent) pb-1">
          <h3 className="text-5xl font-extrabold text-(--subfund-foreground)">
            {subfund.shortName}
          </h3>
          <Image
            className="absolute -top-2.5 right-8 hidden h-34 w-auto lg:block"
            src={`/assets/sub-funds/${subfund.theme}-map.svg`}
            alt={`${subfund.shortName} Map`}
            height={0}
            width={0}
            unoptimized
            loader={coolifyImageLoader}
          />
        </div>
      </div>
    </Link>
  );
};
