import { FieldHook } from 'payload';

export const nullEmptyFieldHook: FieldHook = ({ value }) => {
  if (value !== undefined && value !== null && value?.trim() === '') {
    return null;
  }

  return value;
};
