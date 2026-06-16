import { CMSButtonBlock } from '@/blocks/CMSButton/Component';
import { CollectionListBlock } from '@/blocks/CollectionList/Component';
import { EmphasizedListBlock } from '@/blocks/EmphasizedList/Component';
import { ImageCalloutBlock } from '@/blocks/ImageCallout/Component';
import { OptimizedImageBlock } from '@/blocks/OptimizedImage/Component';
import { SectionColumnsBlock as BaseSectionColumnsBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { cva } from 'class-variance-authority';
import { SectionContentBlock } from '../SectionContent/Component';
import { SectionTitleBlock } from '../SectionTitle/Component';

export type SectionColumnsBlockProps = BaseSectionColumnsBlockProps & {
  searchParams?: Record<string, string | string[] | undefined>;
};

type ColumnWidthOption = 'thirty' | 'forty' | 'fifty' | 'sixty' | 'seventy';

const widthOptions: ColumnWidthOption[] = ['thirty', 'forty', 'fifty', 'sixty', 'seventy'];

const columnBlockComponents = {
  cmsButton: CMSButtonBlock,
  collectionList: CollectionListBlock,
  emphasizedList: EmphasizedListBlock,
  imageCallout: ImageCalloutBlock,
  optimizedImage: OptimizedImageBlock,
  sectionContent: SectionContentBlock,
  sectionTitle: SectionTitleBlock,
};

const columnStyleVariants = cva(
  'flex flex-col items-center mx-auto md:w-full md:mx-0 md:basis-0 md:min-w-0 md:items-start gap-8 group is-columns',
  {
    variants: {
      visibility: {
        mobile: '',
        tablet: 'hidden lg:block',
        desktop: 'hidden xl:block',
      },
      width: {
        thirty: 'md:flex-3', // 30 => 3 / (7 + 3) = 30%
        forty: 'md:flex-2', // 40 => 2 / (3 + 2) = 40%
        fifty: 'md:flex-1', // 50 => 1 / (1 + 1) = 50%
        sixty: 'md:flex-3', // 60 => 3 / (2 + 3) = 60%
        seventy: 'md:flex-7', // 70 => 7 / (7 + 3) = 70%
      },
    },
  },
);

const breakoutWidths = (
  widths: SectionColumnsBlockProps['widths'],
): { first: ColumnWidthOption; second: ColumnWidthOption } => {
  let [first, second] = (widths || '').split('-');

  if (
    !widthOptions.includes(first as ColumnWidthOption) ||
    !widthOptions.includes(second as ColumnWidthOption)
  ) {
    first = 'fifty';
    second = 'fifty';
  }

  return { first, second } as { first: ColumnWidthOption; second: ColumnWidthOption };
};

export const SectionColumnsBlock: React.FC<SectionColumnsBlockProps> = ({
  widths,
  stackAt,
  vertAlign,
  colOne,
  colTwo,
  searchParams,
}) => {
  const colOneHasBlocks =
    colOne?.colBlocks && Array.isArray(colOne.colBlocks) && colOne.colBlocks.length > 0;
  const colTwoHasBlocks =
    colTwo?.colBlocks && Array.isArray(colTwo.colBlocks) && colTwo.colBlocks.length > 0;
  const hasColumns = colOneHasBlocks || colTwoHasBlocks;
  const columnWidths = breakoutWidths(widths);

  if (hasColumns) {
    return (
      <div
        className={cn('flex flex-wrap group-[.content-width-wide]/section:gap-8', {
          'items-start': vertAlign === 'top',
          'items-center': vertAlign === 'center',
          'items-end': vertAlign === 'bottom',
          'flex-col md:flex-row': stackAt === 'mobile',
          'flex-col lg:flex-row': stackAt === 'tablet',
          'flex-col': stackAt === 'desktop',
        })}
      >
        {colOneHasBlocks && (
          <div
            className={columnStyleVariants({
              visibility: colOne.visibility,
              width: columnWidths.first,
            })}
          >
            {colOne.colBlocks?.map((block) => {
              const { blockType } = block;

              if (blockType && blockType in columnBlockComponents) {
                const Block =
                  columnBlockComponents[blockType as keyof typeof columnBlockComponents];

                /* @ts-expect-error There will be mismatches between expected types here */
                return <Block key={block.id} searchParams={searchParams} {...block} />;
              }

              return null;
            })}
          </div>
        )}
        {colTwoHasBlocks && (
          <div
            className={columnStyleVariants({
              visibility: colTwo.visibility,
              width: columnWidths.second,
            })}
          >
            {colTwo.colBlocks?.map((block) => {
              const { blockType } = block;

              if (blockType && blockType in columnBlockComponents) {
                const Block =
                  columnBlockComponents[blockType as keyof typeof columnBlockComponents];

                /* @ts-expect-error There will be mismatches between expected types here */
                return <Block key={block.id} searchParams={searchParams} {...block} />;
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
