import { FieldHook } from 'payload';

export const clearWhenDisabled: FieldHook = ({ siblingData, value }) => {
  if (siblingData.hasAnalyticsEvent === false) {
    return undefined;
  }

  return value;
};
