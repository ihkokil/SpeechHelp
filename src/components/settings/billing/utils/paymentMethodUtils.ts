
/**
 * Card type detection utilities
 */

// Determines the card brand based on card number
export const determineCardBrand = (cardNumber: string) => {
  const firstDigit = cardNumber.charAt(0);
  if (firstDigit === '4') return 'Visa';
  if (firstDigit === '5') return 'Mastercard';
  if (firstDigit === '3') return 'Amex';
  if (firstDigit === '6') return 'Discover';
  return 'Card';
};

/**
 * Card formatting utilities
 */

// Formats a card number with spaces after every 4 digits
export const formatCardNumber = (value: string): string => {
  return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
};

// Detects card type based on the card number prefix
export const detectCardType = (cardNumber: string): string => {
  const amex = /^3[47]/;
  const visa = /^4/;
  const mastercard = /^5[1-5]/;
  const discover = /^6(?:011|5)/;
  
  if (amex.test(cardNumber)) return 'amex';
  if (visa.test(cardNumber)) return 'visa';
  if (mastercard.test(cardNumber)) return 'mastercard';
  if (discover.test(cardNumber)) return 'discover';
  return 'unknown';
};

/**
 * Card validation utilities
 */

// Returns the expected CVV length based on card type
export const getCvvLength = (cardType: string): number => {
  return cardType === 'amex' ? 4 : 3;
};

// Validates if a card number is potentially valid (passes Luhn algorithm)
export const isValidCardNumber = (cardNumber: string): boolean => {
  const digitsOnly = cardNumber.replace(/\D/g, '');
  
  if (digitsOnly.length < 13 || digitsOnly.length > 19) {
    return false;
  }
  
  // Luhn algorithm implementation
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
};

/**
 * Expiration date utilities
 */

// Checks if a card expiration date is valid and not expired
export const isExpirationDateValid = (month: number, year: number): boolean => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
  
  // Convert 2-digit year to 4-digit
  const fullYear = year < 100 ? 2000 + year : year;
  
  // Check if the date is valid
  if (month < 1 || month > 12) {
    return false;
  }
  
  // Check if the card has not expired
  if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};
