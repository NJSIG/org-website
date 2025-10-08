import { UIField } from 'payload';

export type UITipFieldType = (tips: string[]) => UIField;

export const uiTipField: UITipFieldType = (tips) => {
  const fieldResult: UIField = {
    type: 'ui',
    name: 'tip',
    admin: {
      components: {
        Field: {
          path: '@/fields/uiTip/TipComponent#TipComponent',
          clientProps: { tips },
        },
      },
    },
  };

  return fieldResult;
};
