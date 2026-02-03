import { TextFieldValidation } from 'payload';

const VALID_EVENT_NAME_REGEX: RegExp = /^[a-zA-Z0-9 _\-\+]+$/;

export const validateEventName: TextFieldValidation = (value) => {
  if (value == null) {
    return 'Event name is required.';
  }

  if (VALID_EVENT_NAME_REGEX.test(value)) {
    return true;
  }

  return 'Event name can only contain letters, numbers, spaces, underscores, hyphens, and plus signs.';
};
