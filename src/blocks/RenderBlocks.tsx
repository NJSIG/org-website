import { Page } from '@/payload-types';
import { Fragment } from 'react';
import { HeroSpinnerBlock } from './HeroSpinner/Component';
import { HiddenTitleBlock } from './HiddenTitle/Component';

type RenderBlocksProps = {
  blocks: Page['layout']['blocks'];
};

const blockComponents = {
  heroSpinner: HeroSpinnerBlock,
  hiddenTitle: HiddenTitleBlock,
};

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents];

            /* @ts-expect-error There will be mismatches between expected types here */
            return <Block {...block} key={block.id} />;
          }

          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
