export const getPriceWithCorrectDecimals = (price: number): number => {
  return price > 100 ? Math.round(100 * price) / 100 : price;
};
