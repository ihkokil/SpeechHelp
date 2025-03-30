
export const determineCardBrand = (cardNumber: string) => {
  const firstDigit = cardNumber.charAt(0);
  if (firstDigit === '4') return 'Visa';
  if (firstDigit === '5') return 'Mastercard';
  if (firstDigit === '3') return 'Amex';
  if (firstDigit === '6') return 'Discover';
  return 'Card';
};
