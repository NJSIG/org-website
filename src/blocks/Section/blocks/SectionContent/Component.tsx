import { RichText } from '@/components/RichText';
import { SectionContentBlock as SectionContentBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';

export const SectionContentBlock: React.FC<SectionContentBlockProps> = ({
  centerBlock,
  enableGutter,
  content,
}) => {
  return (
    <RichText
      data={content}
      className={cn('max-w-section-content not-last:mb-8 group-[.is-columns]:mb-0', {
        'mx-auto': centerBlock,
      })}
      enableGutter={enableGutter ?? false}
    />
  );
};
