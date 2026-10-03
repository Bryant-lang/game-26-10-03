/**
 * Utility functions for number formatting in 《靈感工坊》
 */

/**
 * Format inspiration, rates, and currency values into K, M, B suffixes for numbers >= 1000.
 * For numbers < 1000, displays an integer or trimmed decimal.
 *
 * Examples:
 *  - 0 -> "0"
 *  - 999 -> "999"
 *  - 1000 -> "1K"
 *  - 1250 -> "1.25K"
 *  - 15000 -> "15K"
 *  - 1500000 -> "1.5M"
 *  - 20000000 -> "20M"
 *  - 1000000000 -> "1B"
 */
export function formatInspiration(value: number): string {
  if (value < 0 || isNaN(value)) return '0';
  if (value < 1000) {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1).replace(/\.0$/, '');
  }

  const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi'];
  const tier = Math.floor(Math.log10(value) / 3) - 1;
  const unitIndex = Math.min(Math.max(tier, 0), units.length - 1);
  const scaled = value / Math.pow(10, (unitIndex + 1) * 3);

  // Format with up to 2 decimal places, trimming trailing zeros
  const formatted = scaled >= 100 ? scaled.toFixed(1) : scaled.toFixed(2);
  const cleanFormatted = formatted.replace(/(\.[0-9]*[1-9])0+$|\.00$/, '$1');

  return `${cleanFormatted}${units[unitIndex]}`;
}

/**
 * Format production rates (per second) using K, M, B for >= 1000,
 * and up to 1 decimal place for < 1000.
 */
export function formatRate(value: number): string {
  if (value < 0 || isNaN(value)) return '0';
  if (value < 1000) {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1).replace(/\.0$/, '');
  }
  return formatInspiration(value);
}
