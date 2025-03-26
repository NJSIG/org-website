import { CheckboxField, TextField } from 'payload';
import { formatSlugHook } from './formatSlug';

type Overrides = {
  slugOverrides?: Partial<TextField>;
  checkboxOverrides?: Partial<CheckboxField>;
};

type SlugType = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField];

export const slugField: SlugType = (fieldToUse = 'title', overrides = {}) => {
  const { slugOverrides, checkboxOverrides } = overrides;

  const checkboxField: CheckboxField = {
    name: 'slugLock',
    type: 'checkbox',
    defaultValue: true,
    admin: {
      hidden: true,
      position: 'sidebar',
    },
    ...checkboxOverrides,
  };

  // @ts-expect-error - TS mismatch Partial<TextField> with TextField
  const slugField: TextField = {
    name: 'slug',
    type: 'text',
    index: true,
    label: 'Slug',
    ...(slugOverrides || {}),
    hooks: {
      // Keep this in for hook or API based updates
      beforeValidate: [formatSlugHook(fieldToUse)],
    },
    admin: {
      position: 'sidebar',
      ...(slugOverrides?.admin || {}),
      components: {
        Field: {
          path: '@fields/slug/SlugComponent#SlugComponent',
          clientProps: {
            fieldToUse,
            checkboxFieldPath: checkboxField.name,
          },
        },
      },
    },
  };

  return [slugField, checkboxField];
};
