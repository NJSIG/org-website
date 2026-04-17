import { Page } from '@/payload-types';
import { Fragment } from 'react';
import { BannerTitleBlock } from './BannerTitle/Component';
import { HeroSpinnerBlock } from './HeroSpinner/Component';
import { HiddenTitleBlock } from './HiddenTitle/Component';
import { PageTitleBlock } from './PageTitle/Component';
import { SectionBlock } from './Section/Component';

type RenderBlocksProps = {
  blocks: Page['layout']['blocks'];
};

const blockComponents = {
  bannerTitle: BannerTitleBlock,
  heroSpinner: HeroSpinnerBlock,
  hiddenTitle: HiddenTitleBlock,
  pageTitle: PageTitleBlock,
  section: SectionBlock,
};

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block) => {
          try {
            const { blockType } = block;

            if (blockType && blockType in blockComponents) {
              const Block = blockComponents[blockType as keyof typeof blockComponents];

              /* @ts-expect-error There will be mismatches between expected types here */
              return <Block {...block} key={block.id} />;
            }
          } catch (error) {
            console.error(`Error rendering block:`, block, error);
          }

          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
