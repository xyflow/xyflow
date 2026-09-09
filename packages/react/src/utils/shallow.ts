/**
 * Compares own enumerable string-keyed properties using Object.is, without
 * converting objects or arrays to Maps. Maps and Sets are compared by entries.
 * Nested values are compared by reference.
 */
export function shallow<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  if (a instanceof Map || b instanceof Map) {
    if (!(a instanceof Map) || !(b instanceof Map) || a.size !== b.size) {
      return false;
    }

    for (const [key, value] of a) {
      if (!b.has(key) || !Object.is(value, b.get(key))) {
        return false;
      }
    }

    return true;
  }

  if (a instanceof Set || b instanceof Set) {
    if (!(a instanceof Set) || !(b instanceof Set) || a.size !== b.size) {
      return false;
    }

    for (const value of a) {
      if (!b.has(value)) {
        return false;
      }
    }

    return true;
  }

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }

  for (const key of keys) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    ) {
      return false;
    }
  }

  return true;
}
