import { EmphasizedListBlock } from '@/blocks/EmphasizedList/Component';
import { EventTilesBlock } from '@/blocks/EventTiles/Component';
import { OptimizedImageBlock } from '@/blocks/OptimizedImage/Component';
import { SectionBlock as SectionBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { SectionColumnsBlock } from './blocks/SectionColumns/Component';
import { SectionContentBlock } from './blocks/SectionContent/Component';
import { SectionTitleBlock } from './blocks/SectionTitle/Component';

const sectionBlockComponents = {
  sectionTitle: SectionTitleBlock,
  sectionCols: SectionColumnsBlock,
  sectionContent: SectionContentBlock,
  optimizedImage: OptimizedImageBlock,
  emphasizedList: EmphasizedListBlock,
  eventTiles: EventTilesBlock,
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
          className={cn('mx-auto w-full group/section', {
            'content-width-normal max-w-section': contentWidth === 'normal',
            'content-width-wide max-w-section-wide': contentWidth === 'wide',
          })}
        >
          {sectionBlocks.map((block) => {
            try {
              const { blockType } = block;

              if (blockType && blockType in sectionBlockComponents) {
                const SectionBlock =
                  sectionBlockComponents[blockType as keyof typeof sectionBlockComponents];

                /* @ts-expect-error There will be mismatches between expected types here */
                return <SectionBlock {...block} key={block.id} />;
              }
            } catch (error) {
              console.error(`Error rendering section block:`, block, error);
            }

            return null;
          })}
        </div>
      </section>
    );
  }

  return null;
};
