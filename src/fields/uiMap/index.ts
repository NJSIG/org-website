import { deepMerge, UIField } from 'payload';

export type UIMapFieldType = (overrides?: Partial<UIField>) => UIField;

export const uiMapField: UIMapFieldType = (overrides = {}) => {
  const fieldResult: UIField = {
    type: 'ui',
    name: 'map',
    admin: {
      components: {
        Field: {
          path: '@/fields/uiMap/MapComponent#MapComponent',
        },
      },
    },
  };

  return deepMerge(fieldResult, overrides);
};
