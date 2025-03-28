/**
 * Simple object check
 * @param item
 * @returns {boolean}
 */
export const isObject = (item: unknown): item is object => {
  return typeof item === 'object' && !Array.isArray(item);
};
