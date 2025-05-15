import { ArrayField, deepMerge, Field } from 'payload';
import { linkField } from '../link';
import {
  AllowedColorVariantsForAppearances,
  AllowedIconsPositionVariantsForAppearances,
  AllowedMicroInteractionVariantsForAppearances,
  AllowedSizeVariantsForAppearances,
  AllowedStyleVariantsForAppearances,
  LinkAppearances,
  LinkDestinations,
} from '../link/types';

export type LinkGroupType = <
  T extends LinkAppearances[] | false | undefined = undefined,
>(options?: {
  appearances?: T;
  variants?: {
    styles?: AllowedStyleVariantsForAppearances<T>[] | false | undefined;
    colors?: AllowedColorVariantsForAppearances<T>[] | false | undefined;
    sizes?: AllowedSizeVariantsForAppearances<T>[] | false | undefined;
    icons?: AllowedIconsPositionVariantsForAppearances<T>[] | false | undefined;
    microInteractions?: AllowedMicroInteractionVariantsForAppearances<T>[] | false | undefined;
  };
  destinations?: LinkDestinations[];
  disableNewTab?: boolean;
  disableLabel?: boolean;
  overrides?: Partial<ArrayField>;
}) => Field;

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
