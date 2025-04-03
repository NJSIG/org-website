import { ArrayField, deepMerge, Field } from 'payload';
import { LinkAppearances, linkField } from '../link';

type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false;
  overrides?: Partial<ArrayField>;
}) => Field;

export const linkGroupField: LinkGroupType = ({ appearances, overrides = {} } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    fields: [
      linkField({
        appearances,
      }),
    ],
    admin: {
      initCollapsed: true,
      components: {
        RowLabel: '@/fields/linkGroup/LinkRowLabel', // Custom row label component for the array field
      },
    },
  };

  return deepMerge(generatedLinkGroup, overrides);
};
