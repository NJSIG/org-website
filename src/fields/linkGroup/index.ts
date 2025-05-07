import { ArrayField, deepMerge, Field } from 'payload';
import { linkField } from '../link';
import { LinkType } from '../link/types';

type LinkGroupType = LinkType & {
  overrides?: Partial<ArrayField>;
};

export const linkGroupField: LinkGroupType = ({
  appearances,
  destinations,
  disableNewTab,
  overrides = {},
} = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    fields: [
      linkField({
        appearances,
        destinations,
        disableNewTab,
      }),
    ],
    admin: {
      initCollapsed: true,
      components: {
        RowLabel: '@/fields/linkGroup/LinkLabel',
      },
    },
  };

  return deepMerge(generatedLinkGroup, overrides);
};
