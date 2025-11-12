export class SaleTransactionDto {
  orderId: number;
  vendorId: number;
  amount: number;
  commission: number;
  stripePaymentId: string;
}
