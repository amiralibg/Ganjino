/**
 * Utility functions for Persian/English number conversion and formatting
 */

// Maps for Persian and Arabic-Indic digits to English digits
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Convert Persian/Arabic digits to English digits
 * Example: "۱۲۳" -> "123", "٤٥٦" -> "456"
 */
export const persianToEnglish = (str: string): string => {
  if (!str) return '';

  let result = str;

  // Convert Persian digits
  PERSIAN_DIGITS.forEach((persianDigit, index) => {
    result = result.replace(new RegExp(persianDigit, 'g'), ENGLISH_DIGITS[index]);
  });

  // Convert Arabic-Indic digits
  ARABIC_DIGITS.forEach((arabicDigit, index) => {
    result = result.replace(new RegExp(arabicDigit, 'g'), ENGLISH_DIGITS[index]);
  });

  return result;
};

/**
 * Convert English digits to Persian digits
 * Example: "123" -> "۱۲۳"
 */
export const englishToPersian = (str: string): string => {
  if (!str) return '';

  let result = str;

  ENGLISH_DIGITS.forEach((englishDigit, index) => {
    result = result.replace(new RegExp(englishDigit, 'g'), PERSIAN_DIGITS[index]);
  });

  return result;
};

/**
 * Format a number with Persian digits and thousand separators
 * Example: 1234567 -> "۱,۲۳۴,۵۶۷"
 */
export const formatPersianNumber = (num: number | string): string => {
  if (num === null || num === undefined || num === '') return '';

  // Convert to number if string
  const numValue = typeof num === 'string' ? parseFloat(persianToEnglish(num)) : num;

  // Check if valid number
  if (isNaN(numValue)) return '';

  // Format with thousand separators using English locale first
  const formatted = new Intl.NumberFormat('en-US').format(Math.round(numValue));

  // Convert to Persian digits
  return englishToPersian(formatted);
};

/**
 * Format a decimal number with Persian digits
 * Example: 1234.567 -> "۱,۲۳۴.۵۶۷"
 */
export const formatPersianDecimal = (num: number | string, decimals: number = 2): string => {
  if (num === null || num === undefined || num === '') return '';

  // Convert to number if string
  const numValue = typeof num === 'string' ? parseFloat(persianToEnglish(num)) : num;

  // Check if valid number
  if (isNaN(numValue)) return '';

  // Format with thousand separators and decimals
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);

  // Convert to Persian digits
  return englishToPersian(formatted);
};

/**
 * Parse a string with Persian/Arabic digits to a number
 * Handles comma separators and returns English number for API calls
 * Example: "۱,۲۳۴" -> 1234, "٤٥٦.٧" -> 456.7
 */
export const parsePersianNumber = (str: string): number => {
  if (!str) return 0;

  // Convert Persian/Arabic to English
  const englishStr = persianToEnglish(str);

  // Remove thousand separators (commas)
  const cleaned = englishStr.replace(/,/g, '');

  // Parse to number
  const num = parseFloat(cleaned);

  return isNaN(num) ? 0 : num;
};

/**
 * Parse a string with Persian/Arabic digits to an integer
 * Example: "۱۲۳" -> 123
 */
export const parsePersianInt = (str: string): number => {
  const num = parsePersianNumber(str);
  return Math.round(num);
};

/**
 * Handle number input change - converts Persian/Arabic to English,
 * removes non-numeric characters, and returns formatted Persian display
 */
export const handleNumberInput = (
  text: string,
  options?: {
    allowDecimals?: boolean;
    maxValue?: number;
    minValue?: number;
  }
): { display: string; value: number; rawEnglish: string } => {
  const { allowDecimals = false, maxValue, minValue } = options || {};

  // Convert Persian/Arabic digits to English
  const englishText = persianToEnglish(text);

  // Remove non-numeric characters (keep digits, decimal point if allowed)
  const pattern = allowDecimals ? /[^0-9.]/g : /[^0-9]/g;
  let cleaned = englishText.replace(pattern, '');

  // Handle multiple decimal points - keep only the first one
  if (allowDecimals && cleaned.includes('.')) {
    const parts = cleaned.split('.');
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }

  // Parse to number
  const numValue = parseFloat(cleaned) || 0;

  // Apply min/max constraints
  let finalValue = numValue;
  if (maxValue !== undefined && finalValue > maxValue) {
    finalValue = maxValue;
    cleaned = finalValue.toString();
  }
  if (minValue !== undefined && finalValue < minValue) {
    finalValue = minValue;
    cleaned = finalValue.toString();
  }

  // Format for display with Persian digits
  const display = cleaned ? englishToPersian(cleaned) : '';

  return {
    display,        // Persian digits for display in UI
    value: finalValue, // Numeric value for calculations
    rawEnglish: cleaned // English digits string for API calls
  };
};

/**
 * Format currency amount with Persian digits and "تومان" suffix
 * Example: 1234567 -> "۱,۲۳۴,۵۶۷ تومان"
 */
export const formatCurrency = (amount: number): string => {
  return `${formatPersianNumber(amount)} تومان`;
};

/**
 * Format percentage with Persian digits
 * Example: 25.5 -> "۲۵.۵٪"
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  const formatted = decimals > 0
    ? formatPersianDecimal(value, decimals)
    : formatPersianNumber(value);
  return `${formatted}٪`;
};
