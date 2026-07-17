import { deepMerge, GroupField } from 'payload';
import { createUpdateConsumedDocumentHook } from '../hooks/createUpdateConsumedDocumentHook';
import { linkField } from '../Link';
import { LinkDestinations } from '../Link/types';
import { lucideIconPickerField } from '../LucideIconPicker';
import { IconNames } from '../LucideIconPicker/types';
import { ResourceField, ResourceTypeOptions } from './types';

export const resourceTypeOptions: ResourceTypeOptions = {
  document: { label: 'Document', value: 'document' },
  audioVideo: { label: 'Audio/Video', value: 'audioVideo' },
  link: { label: 'Link', value: 'link' },
};

const resourceTypeIcons: IconNames[] = [
  'file-text',
  'file-pen',
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
  forceIcon,
  useAsTitle = 'title',
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
              hidden: resourceTypesToUse.length === 1,
            },
          },
          lucideIconPickerField({
            allowedIcons: forceIcon ? [forceIcon] : resourceTypeIcons,
            overrides: {
              name: 'icon',
              label: 'Icon',
              defaultValue: forceIcon || 'paperclip',
              admin: {
                width: '50%',
                description:
                  'The resource icon should be as closely related to the resource as possible.',
                hidden: !!forceIcon,
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
        hooks: {
          afterChange: [createUpdateConsumedDocumentHook(useAsTitle)],
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
        hooks: {
          afterChange: [createUpdateConsumedDocumentHook(useAsTitle)],
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
