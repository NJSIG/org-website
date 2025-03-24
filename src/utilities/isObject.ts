/**
 * Simple object check
 * @param item
 * @returns {boolean}
 */
export default function isObject(item: unknown): item is object {
  return typeof item === 'object' && !Array.isArray(item)
}
