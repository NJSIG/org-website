import { SectionBlock as SectionBlockProps } from '@/payload-types';
import { SectionTitleBlock } from '../SectionTitle/Component';

const sectionBlockComponents = {
  sectionTitle: SectionTitleBlock,
};

export const SectionBlock: React.FC<SectionBlockProps> = ({ sectionBlocks }) => {
  const hasBlocks = sectionBlocks && Array.isArray(sectionBlocks) && sectionBlocks.length > 0;

  if (hasBlocks) {
    return (
      <div className="flex flex-col px-4 pt-8 pb-12 lg:px-6 lg:pt-9 lg:pb-16 2xl:pt-10 2xl:pb-20">
        <div className="lg:max-w-4xl mx-auto">
          {sectionBlocks.map((block) => {
            const { blockType } = block;

            if (blockType && blockType in sectionBlockComponents) {
              const Block =
                sectionBlockComponents[blockType as keyof typeof sectionBlockComponents];

              return <Block {...block} key={block.id} />;
            }

            return null;
          })}
        </div>
      </div>
    );
  }

  return null;
};
