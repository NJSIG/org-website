import { ArrayField, deepMerge, Field, GroupField } from 'payload';
import { LinkDestinations } from '../link/types';
import { resourceField } from '../resource';
import { ResourceTypes } from '../resource/types';

export type ResourceGroupType = (options?: {
  resourceTypes?: ResourceTypes[];
  linkDestinations?: LinkDestinations[];
  overrides?: {
    group?: Partial<ArrayField>;
    row?: Partial<GroupField>;
  };
}) => Field;

export const resourceGroupField: ResourceGroupType = ({
  resourceTypes,
  linkDestinations,
  overrides = {},
} = {}) => {
  const generatedResourceGroup: ArrayField = {
    name: 'resources',
    type: 'array',
    fields: [
      resourceField({
        resourceTypes,
        linkDestinations,
        overrides: overrides.row || {},
      }),
    ],
    admin: {
      initCollapsed: true,
      components: {
        RowLabel: '@/fields/resourceGroup/ResourceLabel',
      },
    },
  };

  return deepMerge(generatedResourceGroup, overrides.group || {});
};
