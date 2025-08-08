import { deepMerge, GroupField } from 'payload';
import { linkField } from '../link';
import { LinkDestinations } from '../link/types';
import { lucideIconPickerField } from '../lucideIconPicker';
import { IconNames } from '../lucideIconPicker/types';
import { ResourceField, ResourceTypeOptions } from './types';

export const resourceTypeOptions: ResourceTypeOptions = {
  document: { label: 'Document', value: 'document' },
  audioVideo: { label: 'Audio/Video', value: 'audioVideo' },
  link: { label: 'Link', value: 'link' },
};

const resourceTypeIcons: IconNames[] = [
  'file-text',
  'presentation',
  'video',
  'audio-lines',
  'podcast',
  'link',
  'paperclip', // Default icon for generic resources
];

export const resourceField: ResourceField = ({
  resourceTypes,
  linkDestinations,
  overrides = {},
} = {}) => {
  let resourceTypesToUse = [
    resourceTypeOptions.document,
    resourceTypeOptions.audioVideo,
    resourceTypeOptions.link,
  ];

  if (resourceTypes) {
    resourceTypesToUse = resourceTypes.map((type) => resourceTypeOptions[type]);
  }

  let linkDestinationsToUse: LinkDestinations[] = ['reference', 'custom'];

  if (linkDestinations) {
    linkDestinationsToUse = linkDestinations;
  }

  const fieldResult: GroupField = {
    name: 'resource',
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
            label: 'Resource Type',
            type: 'select',
            required: true,
            options: [...resourceTypesToUse],
            defaultValue: resourceTypesToUse[0].value,
            admin: {
              width: '50%',
              isClearable: false,
            },
          },
          lucideIconPickerField({
            allowedIcons: resourceTypeIcons,
            overrides: {
              name: 'icon',
              label: 'Icon',
              defaultValue: 'paperclip',
              admin: {
                width: '50%',
                description:
                  'The resource icon should be as closely related to the resource as possible.',
              },
            },
          }),
        ],
      },
      {
        name: 'document',
        type: 'upload',
        relationTo: 'documents',
        admin: {
          condition: (_, siblingData) => siblingData?.type === resourceTypeOptions.document.value,
          description: 'Select or upload a document.',
        },
      },
      {
        name: 'audioVideo',
        label: 'Audio/Video',
        type: 'upload',
        relationTo: 'media',
        filterOptions: {
          or: [{ mimeType: { contains: 'video' } }, { mimeType: { contains: 'audio' } }],
        },
        admin: {
          condition: (_, siblingData) => siblingData?.type === resourceTypeOptions.audioVideo.value,
          description: 'Select or upload a video or audio clip.',
        },
      },
      linkField({
        appearances: false,
        destinations: linkDestinationsToUse,
        overrides: {
          label: 'Link to Resource',
          admin: {
            condition: (_, siblingData) => siblingData?.type === resourceTypeOptions.link.value,
            description: 'Provide a URL to an external resource or a reference to a CMS item.',
          },
        },
      }),
    ],
  };

  return deepMerge(fieldResult, overrides);
};
