import { TextFieldValidation } from 'payload';

type SiblingData = {
  enabled?: boolean;
};

const VALID_VALUES = ['top', 'center', 'bottom'];
const VALID_UNITS: RegExp = /^\d+(?:\.\d+)?(%|em|rem|px)$/;

export const validateVerticalValues: TextFieldValidation = (value, ctx) => {
  if (value == null || (ctx.siblingData as SiblingData).enabled === false) {
    return true;
  }

  const cleanValue = value.trim().toLocaleLowerCase();

  const isValidValue = VALID_VALUES.includes(cleanValue);
  const hasValidUnit = VALID_UNITS.test(cleanValue);

  if (isValidValue || hasValidUnit) {
    return true;
  }

  return 'Vertical position must be top, center, bottom, or a value with %, em, rem, or px units.';
};
