import { FieldHook } from 'payload';

export const populateResourceCountHook: FieldHook = ({ siblingData }) => {
  const resourceCount = siblingData.resources ? siblingData.resources.length : 0;

  return resourceCount;
};
