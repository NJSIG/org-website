import { TextFieldValidation } from 'payload';

type SiblingData = {
  enabled?: boolean;
};

const VALID_VALUES = ['left', 'center', 'right'];
const VALID_UNITS: RegExp = /^\d+(?:\.\d+)?(%|em|rem|px)$/;

export const validateHorizontalValues: TextFieldValidation = (value, ctx) => {
  if (value == null || (ctx.siblingData as SiblingData).enabled === false) {
    return true;
  }

  const isValidValue = VALID_VALUES.includes(value);
  const hasValidUnit = VALID_UNITS.test(value);

  if (isValidValue || hasValidUnit) {
    return true;
  }

  return 'Horizontal position must be left, center, right, or a value with %, em, rem, or px units.';
};
