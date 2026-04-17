import { PageHeader, PageSubtitle, PageTitle } from '@/components/PageHeader';
import { PageTitleBlock as PageTitleBlockProps } from '@/payload-types';

export const PageTitleBlock: React.FC<PageTitleBlockProps> = ({ title, subtitle }) => {
  return (
    <PageHeader>
      <PageTitle>{title}</PageTitle>
      {subtitle && subtitle !== '' && <PageSubtitle>{subtitle}</PageSubtitle>}
    </PageHeader>
  );
};
