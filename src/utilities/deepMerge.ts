// @ts-nocheck

import isObject from './isObject'

/**
 * Deep merge two objects
 * @param target
 * @param source
 * @returns
 */
export default function deepMerge<T, S>(target: T, source: S): T {
  const output = { ...target }

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge((target[key], source[key]))
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}
