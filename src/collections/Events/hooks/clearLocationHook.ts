import { FieldHook } from 'payload';

export const clearLocationHook: FieldHook = ({ siblingData, value }) => {
  if (siblingData.attendanceOptions === 'virtual') {
    return null;
  }

  return value;
};
