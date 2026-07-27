import CustomTags from '@/icons/tags.json';
import LucideTags from 'lucide-static/tags.json';
import { deepMerge, Field, TextFieldSingleValidation } from 'payload';
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
    validate: ((value) => {
      if (typeof value === 'string' && allIcons.includes(value as IconNames)) {
        return true;
      }

      return 'Please select a valid icon';
    }) as TextFieldSingleValidation,
    admin: {
      components: {
        Field: {
          path: '@/fields/LucideIconPicker/LucideIconPickerComponent#LucideIconPickerComponent',
          clientProps: {
            icons: allIcons,
          },
        },
      },
    },
  };

  return deepMerge(pickerResult, overrides);
};
