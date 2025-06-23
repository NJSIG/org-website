'use client';

import { cn } from '@/utilities/cn';
import { BlocksField, useWatchForm, withCondition } from '@payloadcms/ui';
import { useMemo } from 'react';
import './index.scss';
import { BlockSlugs, BlockStub, DynamicBlocksFieldClientComponent, Templates } from './types';

const Component: DynamicBlocksFieldClientComponent = (props) => {
  const { allowedBlocks, field, path } = props;
  const { getDataByPath } = useWatchForm();

  const templateField = getDataByPath(`${path.split('.').slice(0, -1).join('.')}.template`);
  const currentBlocks = getDataByPath<BlockStub[]>(path) || [];

  const filteredBlocks = field.blockReferences?.filter((slug) => {
    if (templateField && Array.isArray(allowedBlocks[templateField as Templates])) {
      return allowedBlocks[templateField as Templates].includes(slug as BlockSlugs);
    }

    return true;
  });

  const disallowedBlocks = currentBlocks
    .map((block, index) => {
      return {
        ...block,
        listIndex: index,
        niceType: block.blockType.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase(),
      };
    })
    .filter(({ blockType }) => {
      if (templateField && Array.isArray(allowedBlocks[templateField as Templates])) {
        return !allowedBlocks[templateField as Templates].includes(blockType as BlockSlugs);
      }

      return false;
    });

  const newField = {
    ...field,
    blockReferences: filteredBlocks || [],
  };

  // Generate Disallowed Blocks CSS
  const disallowedBlocksCSS = useMemo(() => {
    if (disallowedBlocks.length === 0) {
      return null;
    }

    const styles = disallowedBlocks
      .map(
        ({ listIndex }) => `
      #layout-blocks-row-${listIndex} {
        color: var(--theme-warning-800);

        .collapsible--style-default {
          border-color: var(--theme-warning-250);

          .collapsible__toggle-wrap {
            background-color: var(--theme-warning-100);
          }
        }
      }

      .blocks-field.blocks-field--has-error #layout-blocks-row-${listIndex} {
        color: var(--theme-error-800);

        .collapsible--style-default {
          border-color: var(--theme-error-250);

          .collapsible__toggle-wrap {
            background-color: var(--theme-error-100);
          }
        }
      }
    `,
      )
      .join(' ');

    return <style dangerouslySetInnerHTML={{ __html: styles }} />;
  }, [disallowedBlocks]);

  return (
    <div
      className={cn('dynamic-blocks-field', {
        'has-disallowed-blocks': disallowedBlocks.length > 0,
      })}
    >
      {disallowedBlocksCSS}
      {disallowedBlocks.length > 0 && (
        <div className="dynamic-blocks-field__warning">
          <p className="dynamic-blocks-field__warning__message">
            Some blocks are not available in the current template and will be removed if you save
            the document.
          </p>
          <ul>
            {disallowedBlocks.map(({ blockName, niceType, listIndex }) => (
              <li key={listIndex} className="dynamic-blocks-field__warning__block">
                Block{' '}
                <span className="dynamic-blocks-field__warning__block-name">
                  {blockName !== undefined ? `${blockName} (${niceType})` : niceType}
                </span>{' '}
                at position {listIndex + 1}
              </li>
            ))}
          </ul>
        </div>
      )}
      <BlocksField {...props} field={newField} />
    </div>
  );
};

export const DynamicBlocksComponent: DynamicBlocksFieldClientComponent = withCondition(Component);
