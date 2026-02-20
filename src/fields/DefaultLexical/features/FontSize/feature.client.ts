'use client';

import { ToolbarGroup } from '@payloadcms/richtext-lexical';
import {
  createClientFeature,
  toolbarAddDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
} from '@payloadcms/richtext-lexical/lexical';
import { DEFAULT_SIZE, DEFAULT_SIZES } from './defaults';
import { FontSizeIcon } from './icon';
import { FontSizeFeatureProps } from './types';
import { applyFontSizeToNodes, getFirstTextNodeFontSize } from './utils';

const SIZE_LABELS = {
  sm: 'Small',
  base: 'Base',
  lg: 'Large',
  xl: 'XL',
  '2xl': '2XL',
} as const;

export const FontSizeFeatureClient = createClientFeature<FontSizeFeatureProps>(({ props }) => {
  const { enabledSizes = DEFAULT_SIZES, defaultSize = DEFAULT_SIZE } = props;

  const toolbarGroups: ToolbarGroup[] = [
    {
      ...toolbarAddDropdownGroupWithItems(
        enabledSizes.map((size, i) => {
          console.log('Creating toolbar item for size:', size, 'index:', i);
          return {
            ChildComponent: FontSizeIcon,
            isActive: ({ selection }) => {
              if (!$isRangeSelection(selection)) {
                return false;
              }

              for (const node of selection.getNodes()) {
                if ($isTextNode(node) && getFirstTextNodeFontSize([node], defaultSize) === size) {
                  continue;
                }

                const parent = node.getParent();

                if (
                  parent &&
                  $isTextNode(parent) &&
                  getFirstTextNodeFontSize([parent], defaultSize) === size
                ) {
                  continue;
                }

                return false;
              }

              return true;
            },
            key: 'fontSize-' + size,
            label: SIZE_LABELS[size] || size,
            onSelect: ({ editor }) => {
              editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                  const nodes = selection.extract();

                  applyFontSizeToNodes(nodes, size, enabledSizes);
                }
              });
            },
            order: i + 1,
          };
        }),
      ),
      type: 'dropdown',
      order: 35,
      ChildComponent: FontSizeIcon,
    },
  ];

  return {
    sanitizedClientFeatureProps: props,
    toolbarFixed: {
      groups: toolbarGroups,
    },
    toolbarInline: {
      groups: toolbarGroups,
    },
  };
});
