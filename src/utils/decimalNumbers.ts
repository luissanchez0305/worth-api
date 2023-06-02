import Decimal from 'decimal.js';

export const getPriceWithCorrectDecimals = (price: number): number => {
  return price > 100 ? Math.round(100 * price) / 100 : price;
};

export const getDecimalWithCorrectDecimals = (price: Decimal): string => {
  return price.toFixed(price.lessThan(1) ? 8 : 2);
};
