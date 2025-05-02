import tags from 'lucide-static/tags.json';
import { deepMerge, Field } from 'payload';
import { LucideIconNames, LucideIconPickerField } from './types';

type LucideIconPickerType = (options?: {
  allowedIcons?: LucideIconNames[];
  overrides?: Partial<LucideIconPickerField>;
}) => Field;

export const lucideIconPickerField: LucideIconPickerType = ({
  allowedIcons = undefined,
  overrides = {},
} = {}) => {
  const allIcons: LucideIconNames[] = [];

  if (allowedIcons) {
    allIcons.push(...allowedIcons);
  } else {
    allIcons.push(...(Object.keys(tags) as LucideIconNames[]));
  }

  const pickerResult = {
    type: 'text',
    name: 'lucideIcon',
    label: 'Icon Picker',
    defaultValue: 'squirrel',
    validate: (value: string | null | undefined) => {
      if (typeof value === 'string' && allIcons.includes(value as LucideIconNames)) {
        return true;
      }

      return 'Please select a valid icon';
    },
    admin: {
      components: {
        Field: {
          path: '@/fields/lucideIconPicker/LucideIconPickerComponent',
          exportName: 'LucideIconPickerComponent',
          clientProps: {
            icons: allIcons,
          },
        },
      },
    },
  };

  return deepMerge(pickerResult, overrides);
};
