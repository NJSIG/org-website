import { Hero, Section } from '@/blocks';
import { Block, BlocksField, deepMerge, SelectField } from 'payload';
import { AllowedBlocks, DynamicBlocksType, TemplateOptions, Templates } from './types';

export const templateOptions: TemplateOptions = {
  default: { label: 'Default', value: 'default' },
  home: { label: 'Home', value: 'home' },
  subfund: { label: 'Sub-fund', value: 'subfund' },
};

const allBlocks: Block[] = [Hero, Section];

const defaultBlockSlugs: AllowedBlocks = {
  default: ['section'],
  home: ['hero', 'section'],
  subfund: ['section'],
};

export const dynamicBlocksField: DynamicBlocksType = ({
  allowedBlocks: allowedBlockSlugs,
  templateOverrides = {},
  blocksOverrides = {},
} = {}) => {
  const blockSlugs = defaultBlockSlugs;

  // Override allowed blocks if provided
  if (allowedBlockSlugs) {
    Object.keys(allowedBlockSlugs).forEach((template) => {
      blockSlugs[template as Templates] = allowedBlockSlugs[template as Templates];
    });
  }

  // Template Field
  const templateField: SelectField = {
    name: 'template',
    label: 'Page Template',
    type: 'select',
    options: Object.values(templateOptions),
    defaultValue: 'default',
    required: true,
    admin: {
      isClearable: false,
      description:
        'Select the template for this page. The template value will determine which blocks are available.',
    },
  };

  const templateFieldWithOverrides: SelectField = deepMerge(templateField, templateOverrides);

  // Blocks Field
  const blocksField: BlocksField = {
    name: 'blocks',
    label: 'Layout Blocks',
    type: 'blocks',
    required: true,
    admin: {
      components: {
        Field: {
          path: '@/fields/dynamicBlocks/DynamicBlocksComponent#DynamicBlocksComponent',
          clientProps: {
            allowedBlocks: blockSlugs,
          },
        },
      },
    },
    blocks: allBlocks,
  };

  const blocksFieldWithOverrides: BlocksField = deepMerge(blocksField, blocksOverrides);

  return [templateFieldWithOverrides, blocksFieldWithOverrides];
};
