import { deepMerge, UIField } from 'payload';

export type UITipFieldType = (tips: string[], overrides?: Partial<UIField>) => UIField;

export const uiTipField: UITipFieldType = (tips, overrides = {}) => {
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

  return deepMerge(fieldResult, overrides);
};
