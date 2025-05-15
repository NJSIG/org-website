import { deepMerge, Field, GroupField } from 'payload';
import { lucideIconPickerField } from '../lucideIconPicker';
import { clearIconHook } from './hooks/clearIconHook';
import {
  ColorVariantOptions,
  ColorVariants,
  IconPositionVariantOptions,
  IconPositionVariants,
  LinkAppearanceOptions,
  LinkDestinationOptions,
  LinkType,
  MicroInteractionVariantOptions,
  MicroInteractionVariants,
  SizeVariantOptions,
  SizeVariants,
  StyleVariantOptions,
  StyleVariants,
} from './types';

const styleVariantsEnum: StyleVariants[] = ['flat', 'outline', 'ghost'];
const colorVariantsEnum: ColorVariants[] = ['default', 'primary', 'accent'];
const sizeVariantsEnum: SizeVariants[] = ['small', 'medium', 'large'];
const iconPositionVariantsEnum: IconPositionVariants[] = ['none', 'before', 'after'];
const microInteractionVariantsEnum: MicroInteractionVariants[] = ['none', 'wiggle', 'upRight'];

export const linkDestinationOptions: LinkDestinationOptions = {
  reference: {
    label: 'Internal Link',
    value: 'reference',
  },
  custom: {
    label: 'Custom URL',
    value: 'custom',
  },
};

export const linkAppearanceOptions: LinkAppearanceOptions = {
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

export const linkStyleVariantOptions: StyleVariantOptions = {
  flat: {
    label: 'Flat',
    value: 'flat',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
  ghost: {
    label: 'Ghost',
    value: 'ghost',
  },
};

export const linkColorVariantOptions: ColorVariantOptions = {
  default: {
    label: 'Default',
    value: 'default',
  },
  primary: {
    label: 'Primary',
    value: 'primary',
  },
  accent: {
    label: 'Accent',
    value: 'accent',
  },
};

export const linkSizeVariantOptions: SizeVariantOptions = {
  small: {
    label: 'Small',
    value: 'small',
  },
  medium: {
    label: 'Medium',
    value: 'medium',
  },
  large: {
    label: 'Large',
    value: 'large',
  },
};

export const linkIconPositionVariantOptions: IconPositionVariantOptions = {
  none: {
    label: 'None',
    value: 'none',
  },
  before: {
    label: 'Before',
    value: 'before',
  },
  after: {
    label: 'After',
    value: 'after',
  },
};

export const linkMicroInteractionVariantOptions: MicroInteractionVariantOptions = {
  none: {
    label: 'None',
    value: 'none',
  },
  wiggle: {
    label: 'Wiggle',
    value: 'wiggle',
  },
  upRight: {
    label: 'Up Right',
    value: 'upRight',
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

  // Core Fields
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
            label: 'Link Type',
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
      {
        type: 'row',
        fields: [
          {
            name: 'reference',
            label: 'Document to Link To',
            type: 'relationship',
            relationTo: ['pages'], // Add other collections here
            required: true,
            admin: {
              style: {
                flexGrow: 1,
              },
              condition: (_, siblingData) => siblingData?.type === 'reference',
            },
          },
          {
            name: 'url',
            label: 'Custom URL',
            type: 'text',
            required: true,
            admin: {
              style: {
                flexGrow: 1,
              },
              condition: (_, siblingData) => siblingData?.type === 'custom',
            },
          },
          {
            name: 'label',
            type: 'text',
            required: true,
            admin: {
              style: {
                flexGrow: 1,
              },
              condition: () => !disableLabel,
            },
          },
        ],
      },
    ],
  };

  // If appearances are not disabled, add the appearance field
  // and set the default value to the first appearance
  if (appearances !== false) {
    let linkAppearanceOptionsToUse = [
      linkAppearanceOptions.button,
      linkAppearanceOptions.cta,
      linkAppearanceOptions.icon,
    ];

    if (appearances) {
      linkAppearanceOptionsToUse = appearances.map(
        (appearance) => linkAppearanceOptions[appearance],
      );
    }

    const appearanceFields: Field[] = [
      {
        name: 'appearance',
        type: 'select',
        options: linkAppearanceOptionsToUse,
        defaultValue: linkAppearanceOptionsToUse[0].value,
        admin: {
          isClearable: false,
          description: 'Choose how the link will be displayed.',
        },
      },
      {
        type: 'row',
        fields: [
          {
            name: 'styleVariant',
            label: 'Button Type',
            type: 'text',
            typescriptSchema: [
              () => ({
                oneOf: [
                  { type: 'string', enum: styleVariantsEnum },
                  { type: 'boolean', enum: [false] },
                ],
              }),
            ],
            admin: {
              components: {
                Field: {
                  path: '@/fields/link/VariantSelectComponent#VariantSelectComponent',
                  clientProps: {
                    variant: 'style',
                    variantOptions: linkStyleVariantOptions,
                    optionOverrides: variants?.styles || [],
                  },
                },
              },
              style: {
                flexGrow: 1,
              },
              condition: (_, siblingData) =>
                variants?.styles !== false &&
                (siblingData?.appearance === 'button' || siblingData?.appearance === 'cta'),
            },
          },
          {
            name: 'colorVariant',
            label: 'Button Color',
            type: 'text',
            typescriptSchema: [
              () => ({
                oneOf: [
                  { type: 'string', enum: colorVariantsEnum },
                  { type: 'boolean', enum: [false] },
                ],
              }),
            ],
            admin: {
              components: {
                Field: {
                  path: '@/fields/link/VariantSelectComponent#VariantSelectComponent',
                  clientProps: {
                    variant: 'color',
                    variantOptions: linkColorVariantOptions,
                    optionOverrides: variants?.colors || [],
                  },
                },
              },
              style: {
                flexGrow: 1,
              },
              condition: () => variants?.colors !== false,
            },
          },
          {
            name: 'sizeVariant',
            label: 'Button Size',
            type: 'text',
            typescriptSchema: [
              () => ({
                oneOf: [
                  { type: 'string', enum: sizeVariantsEnum },
                  { type: 'boolean', enum: [false] },
                ],
              }),
            ],
            admin: {
              components: {
                Field: {
                  path: '@/fields/link/VariantSelectComponent#VariantSelectComponent',
                  clientProps: {
                    variant: 'size',
                    variantOptions: linkSizeVariantOptions,
                    optionOverrides: variants?.sizes || [],
                  },
                },
              },
              style: {
                flexGrow: 1,
              },
              condition: () => variants?.sizes !== false,
            },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'iconPosition',
            label: 'Icon Position',
            type: 'text',
            typescriptSchema: [
              () => ({
                oneOf: [
                  { type: 'string', enum: iconPositionVariantsEnum },
                  { type: 'boolean', enum: [false] },
                ],
              }),
            ],
            admin: {
              components: {
                Field: {
                  path: '@/fields/link/VariantSelectComponent#VariantSelectComponent',
                  clientProps: {
                    variant: 'iconPosition',
                    variantOptions: linkIconPositionVariantOptions,
                    optionOverrides: variants?.icons || [],
                  },
                },
              },
              style: {
                flexGrow: 1,
              },
              condition: (_, siblingData) =>
                (variants?.icons !== false && siblingData?.appearance === 'button') ||
                siblingData?.appearance === 'cta',
            },
          },
          lucideIconPickerField({
            overrides: {
              name: 'icon',
              label: 'Icon',
              admin: {
                style: {
                  flexGrow: 1,
                },
                condition: (_, siblingData) =>
                  variants?.icons !== false && siblingData?.iconPosition !== 'none',
              },
              hooks: {
                beforeChange: [clearIconHook],
              },
            },
          }),
          {
            name: 'microInteraction',
            label: 'Micro-Interaction',
            type: 'text',
            typescriptSchema: [
              () => ({
                oneOf: [
                  { type: 'string', enum: microInteractionVariantsEnum },
                  { type: 'boolean', enum: [false] },
                ],
              }),
            ],
            admin: {
              components: {
                Field: {
                  path: '@/fields/link/VariantSelectComponent#VariantSelectComponent',
                  clientProps: {
                    variant: 'microInteraction',
                    variantOptions: linkMicroInteractionVariantOptions,
                    optionOverrides: variants?.microInteractions || [],
                  },
                },
              },
              style: {
                flexGrow: 1,
              },
              condition: (_, siblingData) =>
                variants?.icons !== false && siblingData?.iconPosition !== 'none',
            },
          },
        ],
      },
    ];

    linkResult.fields = [...linkResult.fields, ...appearanceFields];
  }

  return deepMerge(linkResult, overrides);
};
