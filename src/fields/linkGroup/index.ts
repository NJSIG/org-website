import { ArrayField, deepMerge, Field } from 'payload';
import { LinkAppearances, LinkDestinations, linkField } from '../link';

type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false;
  destinations?: LinkDestinations[];
  disableNewTab?: boolean;
  overrides?: Partial<ArrayField>;
}) => Field;

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
        RowLabel: '@/fields/linkGroup/LinkRowLabel', // Custom row label component for the array field
      },
    },
  };

  return deepMerge(generatedLinkGroup, overrides);
};
