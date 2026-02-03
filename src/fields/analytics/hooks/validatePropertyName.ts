import { TextFieldValidation } from 'payload';

const VALID_PROPERTY_NAME_REGEX: RegExp = /^[a-zA-Z0-9_]+$/;

export const validatePropertyName: TextFieldValidation = (value) => {
  if (value == null) {
    return 'Property name is required.';
  }

  if (VALID_PROPERTY_NAME_REGEX.test(value)) {
    return true;
  }

  return 'Property name can only contain letters, numbers, and underscores.';
};
