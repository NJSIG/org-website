import { TextFieldValidation } from 'payload';

const VALID_PROPERTY_VALUE_REGEX: RegExp = /^[a-zA-Z0-9 _\-\+]+$/;

export const validatePropertyValue: TextFieldValidation = (value) => {
  if (value == null) {
    return 'Property value is required.';
  }

  if (VALID_PROPERTY_VALUE_REGEX.test(value)) {
    return true;
  }

  return 'Property value can only contain letters, numbers, spaces, underscores, hyphens, and plus signs.';
};
