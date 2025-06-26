import { SectionBlock as SectionBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { OptimizedImageBlock } from '../OptimizedImage/Component';
import { SectionColumnsBlock } from './blocks/SectionColumns/Component';
import { SectionContentBlock } from './blocks/SectionContent/Component';
import { SectionTitleBlock } from './blocks/SectionTitle/Component';

const sectionBlockComponents = {
  sectionTitle: SectionTitleBlock,
  sectionCols: SectionColumnsBlock,
  sectionContent: SectionContentBlock,
  optimizedImage: OptimizedImageBlock,
};

export const SectionBlock: React.FC<SectionBlockProps> = ({
  contentWidth,
  backgroundStyle,
  sectionBlocks,
}) => {
  const hasBlocks = sectionBlocks && Array.isArray(sectionBlocks) && sectionBlocks.length > 0;

  if (hasBlocks) {
    return (
      <section
        className={cn(
          'flex flex-col px-4 pt-8 pb-12 lg:px-6 lg:pt-9 lg:pb-16 2xl:pt-16 2xl:pb-20',
          {
            'bg-azure-to-r dark': backgroundStyle === 'azureGradient',
          },
        )}
      >
        <div
          className={cn('mx-auto group', {
            'section-normal max-w-section': contentWidth === 'normal',
            'section-wide max-w-section-wide': contentWidth === 'wide',
          })}
        >
          {sectionBlocks.map((block) => {
            const { blockType } = block;

            if (blockType && blockType in sectionBlockComponents) {
              const Block =
                sectionBlockComponents[blockType as keyof typeof sectionBlockComponents];

              /* @ts-expect-error There will be mismatches between expected types here */
              return <Block {...block} key={block.id} />;
            }

            return null;
          })}
        </div>
      </section>
    );
  }

  return null;
};
