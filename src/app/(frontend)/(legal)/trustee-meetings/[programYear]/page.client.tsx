'use client';

import {
  TrusteeMeetingCard,
  TrusteeMeetingCardProps,
} from '@/app/(frontend)/(legal)/_components/TrusteeMeeting';
import { PageHeader, PageTitle } from '@/components/PageHeader';
import { SidebarNav } from '../../_components/SidebarNav';

type TrusteeMeetingsPageClientProps = {
  currentYear: string;
  programYears: string[] | null;
  meetings: TrusteeMeetingCardProps[] | null;
};

const TrusteeMeetingsPageClient: React.FC<TrusteeMeetingsPageClientProps> = ({
  currentYear,
  programYears,
  meetings,
}) => {
  const links = programYears
    ? programYears.map((py) => ({
        label: py,
        url: `/trustee-meetings/${py}`,
        isActive: py === currentYear,
      }))
    : [];

  return (
    <>
      <PageHeader>
        <PageTitle>{currentYear} Board of Trustee Meetings</PageTitle>
      </PageHeader>
      <SidebarNav navLabel="Trustee Meetings by Program Year Navigation" links={links}>
        {meetings &&
          meetings.map((meeting) => <TrusteeMeetingCard key={meeting.id} {...meeting} />)}
      </SidebarNav>
    </>
  );
};

export default TrusteeMeetingsPageClient;
