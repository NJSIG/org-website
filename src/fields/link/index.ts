import { Page } from '@/payload-types';
import { deepMerge, Field, GroupField } from 'payload';

export type LinkField = {
  type?: 'reference' | 'custom' | null | undefined;
  newTab?: boolean | null | undefined;
  allowReferrer?: boolean | null | undefined;
  reference?:
    | {
        relationTo: 'pages'; // Add other collections here
        value: string | Page;
      }
    | null
    | undefined;
  url?: string | null | undefined;
  label?: string | null | undefined;
};

export type LinkAppearances = 'default' | 'button'; // TODO: add more appearances

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default (Text Link)',
    value: 'default',
  },
  button: {
    label: 'Button Link',
    value: 'button',
  },
};

export type LinkDestinations = 'reference' | 'custom';

export const destinationOptions: Record<LinkDestinations, { label: string; value: string }> = {
  reference: {
    label: 'Internal Link',
    value: 'reference',
  },
  custom: {
    label: 'Custom URL',
    value: 'custom',
  },
};

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false;
  destinations?: LinkDestinations[];
  disableNewTab?: boolean;
  disableLabel?: boolean;
  overrides?: Partial<GroupField>;
}) => Field;

export const linkField: LinkType = ({
  appearances,
  destinations,
  disableNewTab = false,
  disableLabel = false,
  overrides = {},
} = {}) => {
  let destinationOptionsToUse = [destinationOptions.reference, destinationOptions.custom];

  if (destinations) {
    destinationOptionsToUse = destinations.map((destination) => destinationOptions[destination]);
  }

  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            options: [...destinationOptionsToUse],
            defaultValue: 'reference',
            admin: {
              layout: 'horizontal',
              width: '50%',
              hidden: destinationOptionsToUse.length === 1,
            },
          },
          {
            name: 'newTab',
            label: 'Open in New Tab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '25%',
              condition: () => !disableNewTab,
            },
          },
          {
            name: 'allowReferrer',
            label: 'Allow Referrer',
            type: 'checkbox',
            defaultValue: false,
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '25%',
              condition: (_, siblingData) => siblingData?.type === 'custom',
            },
          },
        ],
      },
    ],
  };

  const linkTypes: Field[] = [
    {
      name: 'reference',
      label: 'Document to Link To',
      type: 'relationship',
      relationTo: ['pages'], // Add other collections here
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
    },
    {
      name: 'url',
      label: 'Custom URL',
      type: 'text',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
    },
  ];

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }));

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    });
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes];
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.default];

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance]);
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      defaultValue: 'default',
      options: appearanceOptionsToUse,
      admin: {
        description: 'Choose how the link will be displayed.',
      },
    });
  }

  return deepMerge(linkResult, overrides);
};
