/**
 * Format a number as INR with the ₹ symbol
 */
export const formatINR = (price: number): string => {
  return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};
