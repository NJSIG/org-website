import { Field } from 'payload';

export const lucideIconField: Field = {
  name: 'lucideIcon',
  label: 'Icon',
  type: 'text',
  required: true,
  localized: false,
  validate: (value: unknown) => {
    if (!value) {
      return 'Enter an icon name';
    }

    return true;
  },
  admin: {
    components: {
      Field: '@/fields/lucideIcon/lucideIconSelector#LucideIconSelector',
    },
  },
};
