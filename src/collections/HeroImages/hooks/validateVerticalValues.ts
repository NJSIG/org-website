import { TextFieldValidation } from 'payload';

type SiblingData = {
  enabled?: boolean;
};

export const validateVerticalValues: TextFieldValidation = (value, ctx) => {
  if (value == null || (ctx.siblingData as SiblingData).enabled === false) {
    return true;
  }

  const validValues = ['top', 'center', 'bottom'];
  const validUnits = ['%', 'em', 'rem', 'px'];

  const isValidValue = validValues.includes(value.toLowerCase());
  const hasValidUnit = validUnits.some((unit) => value.endsWith(unit)) && !isNaN(parseFloat(value));

  if (isValidValue || hasValidUnit) {
    return true;
  }

  return 'Vertical position must be top, center, bottom, or a value with %, em, rem, or px units.';
};
