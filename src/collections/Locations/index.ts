import { editor, editorOrPublished } from '@/access';
import { linkField } from '@/fields/link';
import { patternField } from '@/fields/pattern';
import { CollectionConfig } from 'payload';

export const Locations: CollectionConfig<'locations'> = {
  slug: 'locations',
  access: {
    create: editor,
    delete: editor,
    read: editorOrPublished,
    update: editor,
  },
  admin: {
    defaultColumns: ['name'],
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'text',
      name: 'name',
      required: true,
      admin: {
        description: 'The name of the location.',
      },
    },
    {
      type: 'text',
      name: 'streetAddress',
      required: true,
    },
    {
      type: 'text',
      name: 'streetAddress2',
      admin: {
        description: 'Optional second line for street address.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'city',
          required: true,
          admin: {
            width: '60%',
          },
        },
        {
          type: 'select',
          name: 'state',
          required: true,
          options: [
            { label: 'Alabama', value: 'AL' },
            { label: 'Alaska', value: 'AK' },
            { label: 'Arizona', value: 'AZ' },
            { label: 'Arkansas', value: 'AR' },
            { label: 'California', value: 'CA' },
            { label: 'Colorado', value: 'CO' },
            { label: 'Connecticut', value: 'CT' },
            { label: 'Delaware', value: 'DE' },
            { label: 'Florida', value: 'FL' },
            { label: 'Georgia', value: 'GA' },
            { label: 'Hawaii', value: 'HI' },
            { label: 'Idaho', value: 'ID' },
            { label: 'Illinois', value: 'IL' },
            { label: 'Indiana', value: 'IN' },
            { label: 'Iowa', value: 'IA' },
            { label: 'Kansas', value: 'KS' },
            { label: 'Kentucky', value: 'KY' },
            { label: 'Louisiana', value: 'LA' },
            { label: 'Maine', value: 'ME' },
            { label: 'Maryland', value: 'MD' },
            { label: 'Massachusetts', value: 'MA' },
            { label: 'Michigan', value: 'MI' },
            { label: 'Minnesota', value: 'MN' },
            { label: 'Mississippi', value: 'MS' },
            { label: 'Missouri', value: 'MO' },
            { label: 'Montana', value: 'MT' },
            { label: 'Nebraska', value: 'NE' },
            { label: 'Nevada', value: 'NV' },
            { label: 'New Hampshire', value: 'NH' },
            { label: 'New Jersey', value: 'NJ' },
            { label: 'New Mexico', value: 'NM' },
            { label: 'New York', value: 'NY' },
            { label: 'North Carolina', value: 'NC' },
            { label: 'North Dakota', value: 'ND' },
            { label: 'Ohio', value: 'OH' },
            { label: 'Oklahoma', value: 'OK' },
            { label: 'Oregon', value: 'OR' },
            { label: 'Pennsylvania', value: 'PA' },
            { label: 'Rhode Island', value: 'RI' },
            { label: 'South Carolina', value: 'SC' },
            { label: 'South Dakota', value: 'SD' },
            { label: 'Tennessee', value: 'TN' },
            { label: 'Texas', value: 'TX' },
            { label: 'Utah', value: 'UT' },
            { label: 'Vermont', value: 'VT' },
            { label: 'Virginia', value: 'VA' },
            { label: 'Washington', value: 'WA' },
            { label: 'West Virginia', value: 'WV' },
            { label: 'Wisconsin', value: 'WI' },
            { label: 'Wyoming', value: 'WY' },
          ],
          admin: {
            width: '20%',
          },
        },
        patternField({
          overrides: {
            name: 'zipCode',
            type: 'text',
            required: true,
            minLength: 5,
            maxLength: 9,
            admin: {
              width: '20%',
            },
          },
          pattern: {
            format: '#####-####',
            prefix: '',
            allowEmptyFormatting: false,
          },
        }),
      ],
    },
    {
      type: 'row',
      fields: [
        patternField({
          overrides: {
            name: 'phone',
            type: 'text',
            required: true,
            admin: {
              placeholder: '% 20',
              width: '50%',
            },
          },
          pattern: {
            format: '+1 (###) ### ####',
            prefix: '% ',
            allowEmptyFormatting: false,
          },
        }),
        linkField({
          appearances: false,
          destinations: ['custom'],
          overrides: {
            name: 'website',
            admin: {
              width: '50%',
            },
          },
        }),
      ],
    },
  ],
};
