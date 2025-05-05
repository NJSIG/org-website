import CustomTags from '@/icons/tags.json';
import LucideTags from 'lucide-static/tags.json';
import { deepMerge, Field } from 'payload';
import { IconNames, LucideIconPickerField } from './types';

type LucideIconPickerType = (options?: {
  allowedIcons?: IconNames[];
  overrides?: Partial<LucideIconPickerField>;
}) => Field;

export const lucideIconPickerField: LucideIconPickerType = ({
  allowedIcons = undefined,
  overrides = {},
} = {}) => {
  const allIcons: IconNames[] = [];

  if (allowedIcons) {
    allIcons.push(...allowedIcons);
  } else {
    allIcons.push(
      ...(Object.keys(LucideTags) as IconNames[]),
      ...(Object.keys(CustomTags) as IconNames[]),
    );
  }

  const pickerResult = {
    type: 'text',
    name: 'lucideIcon',
    label: 'Icon Picker',
    defaultValue: 'squirrel',
    validate: (value: string | null | undefined) => {
      if (typeof value === 'string' && allIcons.includes(value as IconNames)) {
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
