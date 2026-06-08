'use client';

import { PageHeader, PageSubtitle, PageTitle } from '@/components/PageHeader';
import { SubfundCapsule } from '@/components/SubfundCapsule';
import { Subfund } from '@/payload-types';
import { useHeaderTheme } from '@/providers/HeaderThemeProvider';
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
      <PageHeader>
        <PageTitle>Sub-funds</PageTitle>
        <PageSubtitle>
          NJSIG consists of seven regional sub-funds that provide risk management education, which
          can substantially reduce statewide workers&apos; compensation costs.
        </PageSubtitle>
      </PageHeader>
      <div className="px-4 py-12 flex flex-col items-center gap-8 max-w-7xl mx-auto">
        {subfunds.map((subfund) => (
          <SubfundCapsule subfund={subfund} key={subfund.shortName} />
        ))}
      </div>
    </>
  );
};

export default SubfundsPageClient;
