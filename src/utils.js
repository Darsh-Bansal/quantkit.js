/** Default number of periods per year (daily trading data). */
export const DEFAULT_PERIODS_PER_YEAR = 252;

/**
 * Throws if `x` is not an array (or typed array) of finite numbers.
 * @param {ArrayLike<number>} x
 * @param {string} name
 * @param {number} [min=1] minimum required length
 */
export function assertNumericArray(x, name = "values", min = 1) {
  const ok = Array.isArray(x) || (ArrayBuffer.isView(x) && !(x instanceof DataView));
  if (!ok) throw new TypeError(`${name} must be an array of numbers`);
  if (x.length < min) {
    throw new RangeError(`${name} must contain at least ${min} value(s)`);
  }
  for (let i = 0; i < x.length; i++) {
    if (typeof x[i] !== "number" || !Number.isFinite(x[i])) {
      throw new TypeError(`${name}[${i}] must be a finite number`);
    }
  }
}

/** Throws unless the two arrays have the same length. */
export function assertSameLength(a, b, nameA = "x", nameB = "y") {
  if (a.length !== b.length) {
    throw new RangeError(`${nameA} and ${nameB} must have the same length`);
  }
}

/** Throws unless `n` is a positive finite number. */
export function assertPositive(n, name) {
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) {
    throw new RangeError(`${name} must be a positive number`);
  }
}

/** Throws unless `n` is an integer >= min. */
export function assertInteger(n, name, min = 1) {
  if (!Number.isInteger(n) || n < min) {
    throw new RangeError(`${name} must be an integer >= ${min}`);
  }
}
