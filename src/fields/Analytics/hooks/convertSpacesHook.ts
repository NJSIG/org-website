import { FieldHook } from 'payload';

export const convertSpacesHook: FieldHook = ({ value }) => {
  if (value === null || value === undefined) {
    return value;
  }

  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return null;
  }

  return trimmedValue.replace(/ /g, '+');
};
