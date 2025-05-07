import { deepMerge, Field, GroupField } from 'payload';
import { LinkAppearanceOptions, LinkDestinations, LinkType } from './types';

export const linkAppearanceOptions: LinkAppearanceOptions = {
  default: {
    label: 'Default (Text Link)',
    value: 'default',
  },
  button: {
    label: 'Button',
    value: 'button',
  },
  cta: {
    label: 'Call to Action Button',
    value: 'cta',
  },
  icon: {
    label: 'Icon Button',
    value: 'icon',
  },
};

export const linkDestinationOptions: Record<LinkDestinations, { label: string; value: string }> = {
  reference: {
    label: 'Internal Link',
    value: 'reference',
  },
  custom: {
    label: 'Custom URL',
    value: 'custom',
  },
};

export const linkField: LinkType = ({
  appearances,
  variants,
  destinations,
  disableNewTab = false,
  disableLabel = false,
  overrides = {},
} = {}) => {
  let linkDestinationOptionsToUse = [
    linkDestinationOptions.reference,
    linkDestinationOptions.custom,
  ];

  if (destinations) {
    linkDestinationOptionsToUse = destinations.map(
      (destination) => linkDestinationOptions[destination],
    );
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
            options: [...linkDestinationOptionsToUse],
            defaultValue: 'reference',
            admin: {
              layout: 'horizontal',
              width: '50%',
              hidden: linkDestinationOptionsToUse.length === 1,
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
    let linkAppearanceOptionsToUse = [linkAppearanceOptions.default];

    if (appearances) {
      linkAppearanceOptionsToUse = appearances.map(
        (appearance) => linkAppearanceOptions[appearance],
      );
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      defaultValue: linkAppearanceOptionsToUse[0].value,
      options: linkAppearanceOptionsToUse,
      admin: {
        description: 'Choose how the link will be displayed.',
      },
    });
  }

  return deepMerge(linkResult, overrides);
};
