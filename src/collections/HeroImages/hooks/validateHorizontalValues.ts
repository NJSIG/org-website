import { TextFieldValidation } from 'payload';

type SiblingData = {
  enabled?: boolean;
};

const VALID_VALUES = ['left', 'center', 'right'];
const VALID_UNITS = ['%', 'em', 'rem', 'px'];

export const validateHorizontalValues: TextFieldValidation = (value, ctx) => {
  if (value == null || (ctx.siblingData as SiblingData).enabled === false) {
    return true;
  }

  const cleanValue = value.trim().toLocaleLowerCase();

  const isValidValue = VALID_VALUES.includes(cleanValue);
  const hasValidUnit =
    VALID_UNITS.some((unit) => cleanValue.endsWith(unit)) && !isNaN(parseFloat(cleanValue));

  if (isValidValue || hasValidUnit) {
    return true;
  }

  return 'Horizontal position must be left, center, right, or a value with %, em, rem, or px units.';
};
