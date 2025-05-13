import { FieldHook } from 'payload';

export const clearIconHook: FieldHook = ({ siblingData, value }) => {
  if (siblingData.iconPosition === 'none') {
    return null;
  }

  return value;
};
