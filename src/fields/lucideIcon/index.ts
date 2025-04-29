import { icons } from 'lucide-react';
import { deepMerge, deepMergeSimple, Field } from 'payload';

const customIcons = {};

const allLucideIconNames = Object.keys(icons);
const allCustomIconNames = Object.keys(customIcons);
const allIconNames = [...allLucideIconNames, ...allCustomIconNames] as const;

export type LucideIconFieldConfig = {
  showPreview?: boolean;
  icons: string[];
};

type LucideIconType = (options?: {
  config?: Omit<LucideIconFieldConfig, 'icons'>;
  overrides?: Partial<Field>;
}) => Field;

export const lucideIconField: LucideIconType = ({ config = {}, overrides = {} } = {}) => {
  const configWithDefaults = deepMergeSimple<LucideIconFieldConfig>(
    {
      showPreview: true,
      icons: allIconNames,
    },
    config,
  );

  const iconResult: Field = {
    name: 'icon',
    label: 'Icon',
    type: 'text',
    validate: (value: unknown) => {
      if (typeof value !== 'string') {
        return 'Icon must be a string';
      }

      const iconName = value as string;
      const isValidIcon = allIconNames.includes(iconName as (typeof allIconNames)[number]);

      if (!isValidIcon) {
        return `Icon "${iconName}" is not a valid icon`;
      }

      return true;
    },
    admin: {
      components: {
        Field: {
          path: '@/fields/lucideIcon/Component#IconPickerComponent',
          clientProps: configWithDefaults,
        },
      },
    },
  };

  return deepMerge(iconResult, overrides);
};
