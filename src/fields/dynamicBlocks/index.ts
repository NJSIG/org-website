import { HeroSpinner, Section } from '@/blocks';
import { Block, BlocksField, deepMerge, SelectField } from 'payload';
import {
  AllowedBlocks,
  DynamicBlocksType,
  SubfundThemeOptions,
  TemplateOptions,
  Templates,
} from './types';

export const templateOptions: TemplateOptions = {
  default: { label: 'Default', value: 'default' },
  home: { label: 'Home', value: 'home' },
  subfund: { label: 'Sub-fund', value: 'subfund' },
};

export const subfundThemeOptions: SubfundThemeOptions = {
  bacceic: { label: 'BACCEIC', value: 'bacceic' },
  caip: { label: 'CAIP', value: 'caip' },
  ericnorth: { label: 'ERIC NORTH', value: 'ericnorth' },
  ericsouth: { label: 'ERIC SOUTH', value: 'ericsouth' },
  ericwest: { label: 'ERIC WEST', value: 'ericwest' },
  mocssif: { label: 'MOCSSIF', value: 'mocssif' },
  njeif: { label: 'NJEIF', value: 'njeif' },
};

const allBlocks: Block[] = [HeroSpinner, Section];

const defaultBlockSlugs: AllowedBlocks = {
  default: ['section'],
  home: ['heroSpinner', 'section'],
  subfund: ['section'],
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

  // Subfund Theme Field
  const subfundThemeField: SelectField = {
    name: 'subfundTheme',
    label: 'Subfund Theme',
    type: 'select',
    options: Object.values(subfundThemeOptions),
    required: true,
    admin: {
      isClearable: false,
      description:
        'Select the theme for this page. The theme value will determine the styling of the blocks.',
      condition: (_, siblingData) => siblingData?.template === 'subfund',
    },
  };

  const subfundThemeFieldWithOverrides: SelectField = deepMerge(
    subfundThemeField,
    overrides.subfundThemeField || {},
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
    blocks: allBlocks,
  };

  const blocksFieldWithOverrides: BlocksField = deepMerge(blocksField, overrides.blocksField || {});

  return [templateFieldWithOverrides, subfundThemeFieldWithOverrides, blocksFieldWithOverrides];
};
