import { SectionBlock as SectionBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { ResponsiveColumnsBlock } from '../ResponsiveColumns/Component';
import { SectionTitleBlock } from '../SectionTitle/Component';

const sectionBlockComponents = {
  sectionTitle: SectionTitleBlock,
  responsiveCols: ResponsiveColumnsBlock,
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
          className={cn('mx-auto', {
            'max-w-4xl': contentWidth === 'normal',
            'max-w-7xl': contentWidth === 'wide',
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
