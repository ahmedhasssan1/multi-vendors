export enum TransactionType {
  SALE = 'SALE',          // Client purchase from vendor
  PAYOUT = 'PAYOUT',      // Admin payout to vendor
  REFUND = 'REFUND',      // Refund to client
  COMMISSION = 'COMMISSION', // Platform commission
  FEE = 'FEE'            // Stripe fee
}