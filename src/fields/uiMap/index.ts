import { UIField } from 'payload';

export const uiMapField: () => UIField = () => {
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

  return fieldResult;
};
