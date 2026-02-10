import { BlocksField, deepMerge, SelectField } from 'payload';
import { uiTipField } from '../UITip';
import { BlockFilters, BlockSlugs, DynamicBlocksType, TemplateOptions, Templates } from './types';

export const templateOptions: TemplateOptions = {
  default: { label: 'Default', value: 'default' },
  home: { label: 'Home', value: 'home' },
  navOnly: { label: 'Navigation Only', value: 'navOnly' },
};

const allTopLevelBlocks: BlockSlugs[] = ['heroSpinner', 'hiddenTitle', 'bannerTitle', 'section'];

const defaultBlockFilters: BlockFilters = {
  default: ['hiddenTitle', 'bannerTitle', 'section'],
  home: ['heroSpinner', 'hiddenTitle', 'section'],
  navOnly: [],
};

export const dynamicBlocksField: DynamicBlocksType = ({
  blockFilters: blockFiltersFromProps,
  localized = false,
  overrides = {},
} = {}) => {
  const blockFilters = { ...defaultBlockFilters };

  // Override block filters if provided
  if (blockFiltersFromProps) {
    Object.keys(blockFiltersFromProps).forEach((template) => {
      blockFilters[template as Templates] = blockFiltersFromProps[template as Templates];
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

  // Blocks Field
  const blocksField: BlocksField = {
    name: 'blocks',
    label: 'Layout Blocks',
    type: 'blocks',
    required: true,
    localized,
    admin: {
      condition: (_, siblingData) => siblingData.template !== 'navOnly',
    },
    blocks: [],
    blockReferences: allTopLevelBlocks,
    filterOptions: ({ siblingData: _siblingData }) => {
      const siblingData = _siblingData as { template?: Templates } | undefined;

      if (siblingData?.template) {
        return blockFilters[siblingData.template] || [];
      }

      return [];
    },
    hooks: {
      beforeChange: [
        ({ value, siblingData: _siblingData }) => {
          const siblingData = _siblingData as { template?: Templates } | undefined;

          if (siblingData?.template === 'navOnly') {
            return [];
          }

          return value;
        },
      ],
    },
  };

  // Tip Field
  const tipField = uiTipField(
    [
      'The Navigation Only template should be used when you need to create a stub page that represents a pre-defined route like "events" or "sub-funds".',
      'It is important that the slug matches the pre-defined route exactly to ensure proper navigation and content rendering.',
    ],
    {
      admin: {
        condition: (_, siblingData) => siblingData.template === 'navOnly',
      },
    },
  );

  return [templateFieldWithOverrides, tipField, blocksField];
};
