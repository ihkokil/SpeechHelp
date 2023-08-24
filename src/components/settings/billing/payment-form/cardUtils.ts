
export const formatCardNumber = (value: string): string => {
  return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
};

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

export const getCvvLength = (cardType: string): number => {
  return cardType === 'amex' ? 4 : 3;
};
