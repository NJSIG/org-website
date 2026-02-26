import { RichText } from '@/components/RichText';
import { SectionContentBlock as SectionContentBlockProps } from '@/payload-types';

export const SectionContentBlock: React.FC<SectionContentBlockProps> = ({ content }) => {
  return <RichText data={content} className="section-content" enableGutter={false} />;
};
