import { CMSButtonBlock } from '@/blocks/CMSButton/Component';
import { ContactListBlock } from '@/blocks/ContactList/Component';
import { EmphasizedListBlock } from '@/blocks/EmphasizedList/Component';
import { EventTilesBlock } from '@/blocks/EventTiles/Component';
import { IconListBlock } from '@/blocks/IconList/Component';
import { ImageCalloutBlock } from '@/blocks/ImageCallout/Component';
import { MetricsBlock } from '@/blocks/Metrics/Component';
import { OptimizedImageBlock } from '@/blocks/OptimizedImage/Component';
import { RelatedCardsBlock } from '@/blocks/RelatedCards/Component';
import { SectionBlock as SectionBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { SectionColumnsBlock } from './blocks/SectionColumns/Component';
import { SectionContentBlock } from './blocks/SectionContent/Component';
import { SectionTitleBlock } from './blocks/SectionTitle/Component';

const sectionBlockComponents = {
  cmsButton: CMSButtonBlock,
  contactList: ContactListBlock,
  emphasizedList: EmphasizedListBlock,
  eventTiles: EventTilesBlock,
  iconList: IconListBlock,
  imageCallout: ImageCalloutBlock,
  metrics: MetricsBlock,
  optimizedImage: OptimizedImageBlock,
  relatedCards: RelatedCardsBlock,
  sectionCols: SectionColumnsBlock,
  sectionContent: SectionContentBlock,
  sectionTitle: SectionTitleBlock,
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
        className={cn('flex flex-col px-4 py-12 lg:px-6', {
          'bg-azure-to-r dark': backgroundStyle === 'azureGradient',
          'bg-azure-100': backgroundStyle === 'azureLight',
        })}
      >
        <div
          className={cn('mx-auto w-full group/section', {
            'content-width-narrow max-w-section-narrow': contentWidth === 'narrow',
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
