import { TextFieldValidation } from 'payload';

const VALID_VALUE_WITH_SPACES_REGEX: RegExp = /^[a-zA-Z0-9 _\-\+]+$/;
const VALID_VALUE_NO_SPACES_REGEX: RegExp = /^[a-zA-Z0-9_\-\+]+$/;

enum FIELDS {
  eventName = 'Event Name',
  propertyName = 'Property Name',
  propertyValue = 'Property Value',
}

enum ERROR_MESSAGES {
  eventName = `${FIELDS.eventName} can only contain letters, numbers, spaces, underscores, hyphens, and plus signs.`,
  propertyName = `${FIELDS.propertyName} can only contain letters, numbers, underscores, hyphens, and plus signs.`,
  propertyValue = `${FIELDS.propertyValue} can only contain letters, numbers, spaces, underscores, hyphens, and plus signs.`,
}

export const validatePlausibleValue: TextFieldValidation = (value, { path }) => {
  const field = path.at(-1);
  let VALID_VALUE_REGEX: RegExp;

  if (!isValidFieldName(field)) {
    return `Invalid field name passed to validation: ${field}`;
  }

  if (value == null) {
    return `${FIELDS[field]} is required.`;
  }

  switch (field) {
    case 'eventName':
    case 'propertyValue':
      VALID_VALUE_REGEX = VALID_VALUE_WITH_SPACES_REGEX;
      break;
    case 'propertyName':
      VALID_VALUE_REGEX = VALID_VALUE_NO_SPACES_REGEX;
      break;
    default:
      return `Unable to determine appropriate validation rules for field: ${field}`;
  }

  if (VALID_VALUE_REGEX.test(value)) {
    return true;
  }

  return ERROR_MESSAGES[field as keyof typeof FIELDS];
};

function isValidFieldName(field: string | number | undefined): field is keyof typeof FIELDS {
  return Object.values(FIELDS).includes(field as FIELDS);
}
