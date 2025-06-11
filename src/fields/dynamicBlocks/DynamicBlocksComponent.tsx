'use client';

import { BlocksField, useWatchForm, withCondition } from '@payloadcms/ui';
import { BlockSlugs, DynamicBlocksFieldClientComponent, Templates } from './types';

const Component: DynamicBlocksFieldClientComponent = (props) => {
  const { allowedBlocks, field, path } = props;
  const { getDataByPath } = useWatchForm();

  const templateField = getDataByPath(`${path.split('.').slice(0, -1).join('.')}.template`);
  const filteredBlocks = field.blockReferences?.filter((slug) => {
    if (templateField && Array.isArray(allowedBlocks[templateField as Templates])) {
      return allowedBlocks[templateField as Templates].includes(slug as BlockSlugs);
    }

    return true;
  });

  const newField = {
    ...field,
    blockReferences: filteredBlocks || [],
  };

  // TODO: Highlight blocks that are not available in the current template
  return <BlocksField {...props} field={newField} />;
};

export const DynamicBlocksComponent: DynamicBlocksFieldClientComponent = withCondition(Component);
