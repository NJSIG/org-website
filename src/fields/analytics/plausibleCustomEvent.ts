import { CheckboxField, deepMerge, GroupField, TextField } from 'payload';
import { uiTipField } from '../uiTip';
import { clearWhenDisabled } from './hooks/clearWhenDisabled';
import { convertSpacesHook } from './hooks/convertSpacesHook';
import { validatePlausibleValue } from './hooks/validatePlausibleValue';

type PlausibleCustomEventType = (overrides?: {
  checkboxOverrides?: Partial<CheckboxField>;
  eventOverrides?: Partial<TextField>;
  propertyNameOverrides?: Partial<TextField>;
  propertyValueOverrides?: Partial<TextField>;
}) => GroupField;

export const plausibleCustomEventField: PlausibleCustomEventType = (overrides = {}) => {
  const {
    checkboxOverrides = {},
    eventOverrides = {},
    propertyNameOverrides = {},
    propertyValueOverrides = {},
  } = overrides;

  const hasAnalyticsEvent: CheckboxField = deepMerge(
    {
      name: 'hasAnalyticsEvent',
      type: 'checkbox',
      label: 'Enable Event',
      defaultValue: false,
      admin: {
        description:
          'Enabling an Analytics Event will send data to Plausible Analytics when this element is interacted with.',
      },
    },
    checkboxOverrides,
  );

  const tipField = uiTipField(
    [
      'Make sure to set up the corresponding Event in the Plausible dashboard (https://analytics.cloud.njsig.org).',
      'All custom events and properties created here must match exactly with those set up in the Plausible dashboard for tracking to work correctly.',
      'Spaces will be converted to plus signs (+) automatically.',
    ],
    {
      admin: {
        condition: (_, siblingData) => siblingData.hasAnalyticsEvent,
      },
    },
  );

  const eventNameField: TextField = deepMerge(
    {
      name: 'eventName',
      type: 'text',
      label: 'Plausible Custom Event Name',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData.hasAnalyticsEvent,
        description:
          'May only contain letters, numbers, spaces, underscores, hyphens, and plus signs. This must match exactly with the Event set up in the Plausible dashboard.',
        placeholder: 'e.g., Button Click',
      },
      hooks: {
        beforeValidate: [convertSpacesHook],
        beforeChange: [clearWhenDisabled],
      },
      validate: validatePlausibleValue,
    },
    eventOverrides,
  );

  const propertyNameField: TextField = deepMerge(
    {
      name: 'propertyName',
      type: 'text',
      label: 'Plausible Custom Property Name',
      required: true,
      admin: {
        description:
          'May only contain letters, numbers, underscores, hyphens, and plus signs. This must match exactly with the Property set up in the Plausible dashboard.',
        placeholder: 'e.g., eventFilter',
      },
      hooks: {
        beforeValidate: [convertSpacesHook],
      },
      validate: validatePlausibleValue,
    },
    propertyNameOverrides,
  );

  const propertyValueField: TextField = deepMerge(
    {
      name: 'propertyValue',
      type: 'text',
      label: 'Property Value',
      required: true,
      admin: {
        description:
          'May only contain letters, numbers, spaces, underscores, hyphens, and plus signs.',
        placeholder: 'e.g., Sub-fund Meetings',
      },
      hooks: {
        beforeValidate: [convertSpacesHook],
      },
      validate: validatePlausibleValue,
    },
    propertyValueOverrides,
  );

  return {
    type: 'group',
    name: 'analytics',
    label: 'Custom Analytics Event',
    admin: {
      hideGutter: true,
    },
    fields: [
      hasAnalyticsEvent,
      tipField,
      eventNameField,
      {
        type: 'array',
        name: 'properties',
        label: 'Custom Properties',
        maxRows: 30, // This is a limit imposed by Plausible
        admin: {
          initCollapsed: true,
          condition: (_, siblingData) => siblingData.hasAnalyticsEvent,
          components: {
            RowLabel: '@/fields/analytics/PropertyLabel',
          },
        },
        hooks: {
          beforeChange: [clearWhenDisabled],
        },
        fields: [propertyNameField, propertyValueField],
      },
    ],
  };
};
