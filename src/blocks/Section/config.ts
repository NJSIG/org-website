import { Block } from 'payload';

export const Section: Block = {
  slug: 'section',
  interfaceName: 'SectionBlock',
  fields: [
    {
      type: 'blocks',
      name: 'sectionBlocks',
      required: true,
      blocks: [],
      blockReferences: ['sectionTitle'],
      defaultValue: [{ blockType: 'sectionTitle' }],
    },
  ],
};
