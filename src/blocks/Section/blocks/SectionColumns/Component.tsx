import { CMSButtonBlock } from '@/blocks/CMSButton/Component';
import { EmphasizedListBlock } from '@/blocks/EmphasizedList/Component';
import { OptimizedImageBlock } from '@/blocks/OptimizedImage/Component';
import { SectionColumnsBlock as SectionColumnsBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { cva } from 'class-variance-authority';
import { SectionContentBlock } from '../SectionContent/Component';
import { SectionTitleBlock } from '../SectionTitle/Component';

const columnBlockComponents = {
  sectionTitle: SectionTitleBlock,
  sectionContent: SectionContentBlock,
  cmsButton: CMSButtonBlock,
  optimizedImage: OptimizedImageBlock,
  emphasizedList: EmphasizedListBlock,
};

// TODO: Does the breakpoint for desktop need to be 2xl instead of xl?
const columnStyleVariants = cva(
  'group-[.content-width-normal]/section:max-w-section-content group-[.content-width-wide]/section:max-w-section-wide-content flex flex-col items-center md:items-start gap-8',
  {
    variants: {
      visibility: {
        mobile: '',
        tablet: 'hidden lg:block',
        desktop: 'hidden xl:block',
      },
    },
  },
);

export const SectionColumnsBlock: React.FC<SectionColumnsBlockProps> = ({
  vertAlign,
  colOne,
  colTwo,
}) => {
  const colOneHasBlocks =
    colOne?.colBlocks && Array.isArray(colOne.colBlocks) && colOne.colBlocks.length > 0;
  const colTwoHasBlocks =
    colTwo?.colBlocks && Array.isArray(colTwo.colBlocks) && colTwo.colBlocks.length > 0;
  const hasColumns = colOneHasBlocks || colTwoHasBlocks;

  if (hasColumns) {
    return (
      <div
        className={cn('flex justify-between group-[.content-width-wide]/section:gap-32', {
          'items-start': vertAlign === 'top',
          'items-center': vertAlign === 'center',
          'items-end': vertAlign === 'bottom',
        })}
      >
        {colOneHasBlocks && (
          <div className={columnStyleVariants({ visibility: colOne.visibility })}>
            {colOne.colBlocks?.map((block) => {
              const { blockType } = block;

              if (blockType && blockType in columnBlockComponents) {
                const Block =
                  columnBlockComponents[blockType as keyof typeof columnBlockComponents];

                /* @ts-expect-error There will be mismatches between expected types here */
                return <Block {...block} key={block.id} />;
              }

              return null;
            })}
          </div>
        )}
        {colTwoHasBlocks && (
          <div className={columnStyleVariants({ visibility: colTwo.visibility })}>
            {colTwo.colBlocks?.map((block) => {
              const { blockType } = block;

              if (blockType && blockType in columnBlockComponents) {
                const Block =
                  columnBlockComponents[blockType as keyof typeof columnBlockComponents];

                /* @ts-expect-error There will be mismatches between expected types here */
                return <Block {...block} key={block.id} />;
              }

              return null;
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
};
