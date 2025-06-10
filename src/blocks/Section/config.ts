import { Block } from 'payload';

const sectionBlocks: Block[] = [];

export const Section: Block = {
  slug: 'section',
  interfaceName: 'SectionBlock',
  fields: [
    {
      type: 'blocks',
      name: 'sectionBlocks',
      blocks: sectionBlocks,
    },
  ],
};
