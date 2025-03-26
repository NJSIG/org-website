import { deepMerge, Field, GroupField } from 'payload';

export type LinkAppearances = 'default'; // TODO: add more appearances

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default (Text Link)',
    value: 'default',
  },
};

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false;
  disableLabel?: boolean;
  overrides?: Partial<GroupField>;
}) => Field;

export const linkField: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
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
            options: [
              {
                label: 'Internal Link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
            defaultValue: 'reference',
            admin: {
              layout: 'horizontal',
              width: '50%',
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
              width: '50%',
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
        width: '100%',
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
