import { icons } from 'lucide-react';
import { deepMerge, Field } from 'payload';
import { LucideIconPickerField } from './types';

type LucideIconPickerType = (options?: {
  allowedIcons?: string[];
  overrides?: Partial<LucideIconPickerField>;
}) => Field;

export const lucideIconPickerField: LucideIconPickerType = ({
  allowedIcons = undefined,
  overrides = {},
} = {}) => {
  const allIcons: string[] = [];

  if (allowedIcons) {
    allIcons.push(...allowedIcons);
  } else {
    Object.keys(icons).forEach((icon) => {
      allIcons.push(icon);
    });
  }

  const pickerResult = {
    type: 'text',
    name: 'lucideIcon',
    label: 'Icon Picker',
    icons: allIcons,
    admin: {
      components: {
        Field: {
          path: '@/fields/lucideIconPicker/LucideIconPickerComponent',
          exportName: 'LucideIconPickerComponent',
        },
      },
    },
  };

  return deepMerge(pickerResult, overrides);
};
