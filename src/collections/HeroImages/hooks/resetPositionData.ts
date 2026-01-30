import { FieldHook } from 'payload';

export const resetPositionData: FieldHook = ({ siblingData, value }) => {
  if (siblingData.enabled === false || value === null || value === undefined) {
    return null;
  }

  if (value.trim() === '') {
    return null;
  }

  return value.trim().toLowerCase();
};
