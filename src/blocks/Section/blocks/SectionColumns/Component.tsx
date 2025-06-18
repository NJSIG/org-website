import { SectionColumnsBlock as SectionColumnsBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { SectionTitleBlock } from '../SectionTitle/Component';

const columnBlockComponents = {
  sectionTitle: SectionTitleBlock,
};

// TODO: Does the breakpoint for desktop need to be 2xl instead of xl?

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
        className={cn('flex justify-between', {
          'items-start': vertAlign === 'top',
          'items-center': vertAlign === 'center',
          'items-end': vertAlign === 'bottom',
        })}
      >
        {colOneHasBlocks && (
          <div
            className={cn({
              hidden: colOne.visibility !== 'mobile',
              'lg:block': colOne.visibility === 'tablet',
              'xl:block': colOne.visibility === 'desktop',
            })}
          >
            {colOne.colBlocks?.map((block) => {
              const { blockType } = block;

              if (blockType && blockType in columnBlockComponents) {
                const Block =
                  columnBlockComponents[blockType as keyof typeof columnBlockComponents];

                return <Block {...block} key={block.id} />;
              }

              return null;
            })}
          </div>
        )}
        {colTwoHasBlocks && (
          <div
            className={cn({
              hidden: colTwo.visibility !== 'mobile',
              'lg:block': colTwo.visibility === 'tablet',
              'xl:block': colTwo.visibility === 'desktop',
            })}
          >
            {colTwo.colBlocks?.map((block) => {
              const { blockType } = block;

              if (blockType && blockType in columnBlockComponents) {
                const Block =
                  columnBlockComponents[blockType as keyof typeof columnBlockComponents];

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
