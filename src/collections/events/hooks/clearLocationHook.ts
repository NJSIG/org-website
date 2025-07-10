import { FieldHook } from 'payload';

export const clearLocationHook: FieldHook = ({ siblingData, value }) => {
  if (siblingData.type === 'virtual') {
    return null;
  }

  return value;
};
