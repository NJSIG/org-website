import { BlocksField, deepMerge, SelectField } from 'payload';
import { uiTipField } from '../uiTip';
import { BlockFilters, BlockSlugs, DynamicBlocksType, TemplateOptions, Templates } from './types';

export const templateOptions: TemplateOptions = {
  default: { label: 'Default', value: 'default' },
  home: { label: 'Home', value: 'home' },
  navOnly: { label: 'Navigation Only', value: 'navOnly' },
};

const allTopLevelBlocks: BlockSlugs[] = ['heroSpinner', 'hiddenTitle', 'section'];

const defaultBlockFilters: BlockFilters = {
  default: ['hiddenTitle', 'section'],
  home: ['heroSpinner', 'hiddenTitle', 'section'],
  navOnly: [],
};

export const dynamicBlocksField: DynamicBlocksType = ({
  blockFilters: blockFiltersFromProps,
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
  };

  return [
    uiTipField([
      'The Navigation Only template can be used to create page stubs to add pre-defined routes to areas of the site that only accept page relationships.',
    ]),
    templateFieldWithOverrides,
    blocksField,
  ];
};
