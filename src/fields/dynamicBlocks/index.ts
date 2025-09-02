import { BlocksField, deepMerge, JSONField, SelectField } from 'payload';
import {
  AllowedBlocks,
  BlockSlugs,
  BlockStub,
  DynamicBlocksType,
  TemplateOptions,
  Templates,
} from './types';

type DynamicBlocksStub = {
  allowedBlocks: AllowedBlocks;
  template: Templates;
};

export const templateOptions: TemplateOptions = {
  default: { label: 'Default', value: 'default' },
  home: { label: 'Home', value: 'home' },
};

const allBlocks: BlockSlugs[] = ['heroSpinner', 'hiddenTitle', 'section'];

const defaultBlockSlugs: AllowedBlocks = {
  default: ['hiddenTitle', 'section'],
  home: ['heroSpinner', 'hiddenTitle', 'section'],
};

export const dynamicBlocksField: DynamicBlocksType = ({
  allowedBlocks: allowedBlockSlugs,
  overrides = {},
} = {}) => {
  const blockSlugs = { ...defaultBlockSlugs };

  // Override allowed blocks if provided
  if (allowedBlockSlugs) {
    Object.keys(allowedBlockSlugs).forEach((template) => {
      blockSlugs[template as Templates] = allowedBlockSlugs[template as Templates];
    });
  }

  // Allowed Blocks Field
  const allowedBlocksField: JSONField = {
    name: 'allowedBlocks',
    type: 'json',
    defaultValue: blockSlugs,
    virtual: true,
    admin: {
      hidden: true,
    },
  };

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

  const templateFieldWithOverrides: SelectField = deepMerge(
    templateField,
    overrides.templateField || {},
  );

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
    blocks: [],
    blockReferences: allBlocks,
    validate: (value, { siblingData }) => {
      const template = (siblingData as DynamicBlocksStub)?.template;
      const allowedBlocks = (siblingData as DynamicBlocksStub)?.allowedBlocks?.[template] || [];
      const invalidBlocks = [];

      if (Array.isArray(value) && value.length > 0) {
        (value as BlockStub[]).forEach((block) => {
          if (!allowedBlocks.includes(block.blockType as BlockSlugs)) {
            invalidBlocks.push(block.blockType);
          }
        });
      }

      return invalidBlocks.length === 0 || 'Some blocks are not allowed for the selected template.';
    },
  };

  return [allowedBlocksField, templateFieldWithOverrides, blocksField];
};
