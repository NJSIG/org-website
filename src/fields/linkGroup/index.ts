import { ArrayField, deepMerge, Field } from 'payload';
import { linkField } from '../link';
import { LinkAppearances, LinkType } from '../link/types';

// Extract the parameter type from LinkType
// This is a hacky way to mirror the LinkType signature while replacing the type
// of the overrides property with ArrayField
// @ts-expect-error - This throws an error because LinkType is not generic but the signature is
type LinkTypeParams<T> = Parameters<LinkType<T>>[0];

// Create LinkGroupType by modifying only the overrides property
export type LinkGroupType = <T extends LinkAppearances[] | false | undefined = undefined>(
  options?: Omit<LinkTypeParams<T>, 'overrides'> & { overrides?: Partial<ArrayField> },
) => Field;

export const linkGroupField: LinkGroupType = ({
  appearances,
  variants,
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
        variants,
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
