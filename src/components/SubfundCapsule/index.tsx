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
      className="subfund-theme group/capsule relative flex w-full items-center rounded-3xl bg-(--subfund-capsule-bg) p-6 transition-colors hover:bg-mix-shade-(--subfund-capsule-bg)/2"
    >
      <h3 className="grow text-5xl font-extrabold text-(--subfund-foreground) after:absolute after:block after:h-2.5 after:w-full after:bg-(--subfund-accent)">
        {subfund.shortName}
      </h3>
      <Image
        className="h-32 w-auto"
        src={`/assets/sub-funds/${subfund.theme}-map.svg`}
        alt={`${subfund.shortName} Map`}
        height={0}
        width={0}
        unoptimized
        loader={coolifyImageLoader}
      />
      <ArrowUpRightIcon
        size="24"
        className="self-start stroke-(--subfund-foreground) group-hover/capsule:motion-safe:animate-micro-up-right"
      />
    </Link>

    // <Link
    //   href={`/sub-funds/${subfund.slug}`}
    //   data-subfund-theme={subfund.theme}
    //   className="subfund-theme group/capsule flex w-full flex-col rounded-3xl bg-(--subfund-capsule-bg) p-6 transition-colors hover:bg-mix-shade-(--subfund-capsule-bg)/2"
    // >
    //   <ArrowUpRightIcon
    //     size="24"
    //     className="ml-auto stroke-(--subfund-foreground) group-hover/capsule:motion-safe:animate-micro-up-right"
    //   />
    //   <div className="relative flex min-h-44 items-center">
    //     <div className="w-full border-b-10 border-(--subfund-accent) pb-2">
    //       <h3 className="text-5xl font-extrabold text-(--subfund-foreground)">
    //         {subfund.shortName}
    //       </h3>
    //     </div>
    //   </div>
    //   {/* <Image
    //     className="absolute top-8 right-16 hidden h-32 w-auto md:block"
    //     src={`/assets/sub-funds/${subfund.theme}-map.svg`}
    //     alt={`${subfund.shortName} Map`}
    //     height={0}
    //     width={0}
    //     unoptimized
    //     loader={coolifyImageLoader}
    //   /> */}
    // </Link>
  );
};
