/**
 * Gold unit conversion utilities
 *
 * سوت (soot) is a traditional Persian unit for measuring gold weight
 * 1 سوت = 0.01 grams (1/100th of a gram)
 * Therefore: 1 gram = 100 سوت
 */

export const SOOT_TO_GRAMS = 0.01;
export const GRAMS_TO_SOOT = 100;

/**
 * Convert grams to سوت (soot)
 * @param grams - Weight in grams
 * @returns Weight in سوت
 */
export function gramsToSoot(grams: number): number {
  return grams * GRAMS_TO_SOOT;
}

/**
 * Convert سوت (soot) to grams
 * @param soot - Weight in سوت
 * @returns Weight in grams
 */
export function sootToGrams(soot: number): number {
  return soot * SOOT_TO_GRAMS;
}

/**
 * Format gold weight based on locale
 * For Persian locale: returns سوت
 * For other locales: returns grams and milligrams
 */
export interface GoldWeightFormatted {
  primary: {
    value: number;
    unit: string;
  };
  secondary?: {
    value: number;
    unit: string;
  };
}

export function formatGoldWeight(grams: number): GoldWeightFormatted {
  const soot = gramsToSoot(grams);
  
  if (grams < 1) {
    return {
      primary: {
        value: soot,
        unit: 'سوت',
      },
      secondary: {
        value: grams,
        unit: 'گرم',
      },
    };
  }

  return {
    primary: {
      value: grams,
      unit: 'گرم',
    },
    secondary: {
      value: soot,
      unit: 'سوت',
    },
  };
}
