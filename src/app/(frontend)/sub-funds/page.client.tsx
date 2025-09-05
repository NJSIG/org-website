'use client';

import { PageTitle } from '@/components/PageTitle';
import { SubfundCapsule } from '@/components/SubfundCapsule';
import { Subfund } from '@/payload-types';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { useEffect } from 'react';

type SubfundsPageClientProps = {
  subfunds: Subfund[];
};

const SubfundsPageClient: React.FC<SubfundsPageClientProps> = ({ subfunds }) => {
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme('dark');
  }, [setHeaderTheme]);

  return (
    <>
      <PageTitle
        title="Subfunds"
        subtitle="NJSIG's consists of seven regional sub-funds that provide risk management education, which can substantially reduce statewide workers' compensation costs. "
      />
      <div className="px-4 pt-8 pb-12 flex flex-col items-center gap-8 max-w-7xl mx-auto">
        {subfunds.map((subfund) => (
          <SubfundCapsule subfund={subfund} key={subfund.shortName} />
        ))}
      </div>
    </>
  );
};

export default SubfundsPageClient;
