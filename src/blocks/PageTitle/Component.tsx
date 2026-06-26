import { PageHeader, PageTitle } from '@/components/PageHeader';
import { RichText } from '@/components/RichText';
import { PageTitleBlock as PageTitleBlockProps } from '@/payload-types';

export const PageTitleBlock: React.FC<PageTitleBlockProps> = ({ title, subtitle }) => {
  return (
    <PageHeader>
      <PageTitle>{title}</PageTitle>
      {subtitle && <RichText data={subtitle} className="text-njsig-shade" />}
    </PageHeader>
  );
};
