import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { TransactionType } from 'src/common/enum/transaction.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entity/wallet.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import { VendorsService } from 'src/vendors/vendors.service';

@Injectable()
export class WalletService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private configService: ConfigService,
    private orderService: OrdersService,
    private VendorServie: VendorsService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(stripeKey as string);
  }

  // Create a new wallet for a vendor
  async createWallet(vendorId: number, currency = 'USD'): Promise<Wallet> {
    // Check if wallet already exists
    const existingWallet = await this.walletRepository.findOne({
      where: { vendor: { id: Number(vendorId) } },
      relations: ['vendor'],
    });
    if (existingWallet) {
      return existingWallet;
    }
    const vendor = await this.VendorServie.findVendorById(vendorId);
    if (!vendor) {
      throw new NotFoundException('this vendor not  exist');
    }
    console.log('debugging inside wallet', vendor.email);

    const account = await this.stripe.accounts.create({
      type: 'standard',
      country: 'US',
      email: vendor.email,
      business_type: 'individual',
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },

      metadata: { vendorId: vendorId },
    });
    const checkacc = await this.checkAccountCapabilities(account.id);
    console.log('debugging check', account);

    // Create new wallet
    const wallet = {
      vendor,
      stripeAccountId: account.id,
      balance: 0,
      pendingBalance: 0,
      currency,
      lastUpdated: new Date(),
    };
    console.log('debugging check', wallet);

    const new_walllet = this.walletRepository.create(wallet);
    return await this.walletRepository.save(new_walllet);
  }

  async checkAccountCapabilities(accountId: string) {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);
      console.log(
        'Transfer capability status:',
        account.capabilities?.transfers,
      );
      console.log(
        'Requirements currently due:',
        account.requirements?.currently_due,
      );
      return account.capabilities;
    } catch (error) {
      throw new BadRequestException(
        `Failed to check capabilities: ${error.message}`,
      );
    }
  }
  // Get wallet by vendor ID
  async getWallet(vendorId: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { vendor: { id: Number(vendorId) } },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet for vendor ${vendorId} not found`);
    }
    return wallet;
  }

  async syncWalletWithStripe(vendorId: number): Promise<Wallet> {
    const wallet = await this.getWallet(vendorId);

    try {
      const stripeBalance = await this.stripe.balance.retrieve({
        stripeAccount: wallet.stripeAccountId,
      });

      wallet.balance =
        stripeBalance.available.reduce(
          (sum, bal) =>
            sum +
            (bal.currency === wallet.currency.toLowerCase() ? bal.amount : 0),
          0,
        ) / 100;

      wallet.pendingBalance =
        stripeBalance.pending.reduce(
          (sum, bal) =>
            sum +
            (bal.currency === wallet.currency.toLowerCase() ? bal.amount : 0),
          0,
        ) / 100;

      wallet.lastUpdated = new Date();

      return this.walletRepository.save(wallet);
    } catch (error) {
      throw new BadRequestException(`Failed to sync wallet: ${error.message}`);
    }
  }

  // Process a sale transaction
  async processSaleTransaction(
    orderId: number,
    vendorId: number,
    amount: number,
    commission: number,
    stripePaymentId: string,
  ): Promise<Transaction> {
    const wallet = await this.getWallet(vendorId);

    // Create the main sale transaction
    const saleTransaction = {
      walletId: wallet.id,
      amount: amount - commission,
      type: TransactionType.SALE,
      status: 'completed',
      orderId,
      stripePaymentId,
      description: `Sale payment for order #${orderId}`,
      metadata: {
        originalAmount: amount,
        commission: commission,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create commission transaction record
    const commissionTransaction = {
      wallet: wallet,
      amount: -commission,
      type: TransactionType.COMMISSION,
      status: 'completed',
      orderId,
      stripePaymentId,
      description: `Platform commission for order #${orderId}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save both transactions
    const commision = this.transactionRepository.create(commissionTransaction);
    const savedSaleTransaction =
      this.transactionRepository.create(saleTransaction);

    // Update wallet balance (although we'll rely on Stripe for source of truth)
    wallet.pendingBalance += amount - commission;
    await this.walletRepository.save(wallet);
    await this.transactionRepository.save(savedSaleTransaction);
    return await this.transactionRepository.save(commision);
  }

  // Process a payout to vendor
  async processPayout(
    vendorId: number,
    amount: number,
    description = 'Payout to vendor',
  ): Promise<Transaction> {
    const wallet = await this.getWallet(vendorId);

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient funds for payout');
    }

    try {
      // Create Stripe payout
      const payout = await this.stripe.payouts.create(
        {
          amount: Math.round(amount * 100),
          currency: wallet.currency.toLowerCase(),
          description: description,
        },
        {
          stripeAccount: wallet.stripeAccountId,
        },
      );

      // Record transaction
      const transaction = {
        walletId: wallet.id,
        amount: -amount, // Negative because it's outgoing
        type: TransactionType.PAYOUT,
        status: payout.status === 'paid' ? 'completed' : 'pending',
        stripeTransferId: payout.id,
        description: description,
        metadata: {
          payoutMethod: payout.method,
          arrivalDate: payout.arrival_date
            ? new Date(payout.arrival_date * 1000)
            : null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const savedTransaction =
        await this.transactionRepository.create(transaction);

      // Update wallet balance
      if (payout.status === 'paid') {
        wallet.balance -= amount;
      } else {
        wallet.pendingBalance -= amount;
      }

      await this.walletRepository.save(wallet);

      return savedTransaction;
    } catch (error) {
      throw new BadRequestException(`Payout failed: ${error.message}`);
    }
  }

  // Process a refund
  async processRefund(
    orderId: number,
    vendorId: number,
    amount: number,
    reason = 'customer_requested',
    isAdminRefund = false,
  ): Promise<Transaction> {
    // Get the order and related payment info
    const order = await this.orderService.findById(Number(orderId));
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const wallet = await this.getWallet(vendorId);

    if (!isAdminRefund && wallet.balance < amount) {
      throw new BadRequestException('Insufficient funds for refund');
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: order.stripe_payment_intent_id,
        amount: Math.round(amount * 100),
        reason: reason as Stripe.RefundCreateParams.Reason,
      });

      // Record transaction
      const transaction = {
        walletId: wallet.id,
        amount: -amount,
        type: TransactionType.REFUND,
        status: refund.status === 'succeeded' ? 'completed' : 'pending',
        orderId,
        stripePaymentId: order.stripe_payment_intent_id,
        stripeRefundId: refund.id,
        description: `Refund for order #${orderId}`,
        metadata: {
          reason,
          isAdminRefund,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const savedTransaction =
        await this.transactionRepository.create(transaction);

      if (!isAdminRefund && refund.status === 'succeeded') {
        wallet.balance -= amount;
        await this.walletRepository.save(wallet);
      }

      return savedTransaction;
    } catch (error) {
      throw new BadRequestException(`Refund failed: ${error.message}`);
    }
  }

  async getTransactionHistory(
    vendorId: number,
    filters = {},
    page = 1,
    limit = 20,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const wallet = await this.getWallet(vendorId);

    const skip = (page - 1) * limit;

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: { wallet, ...filters },
        order: { createdAt: 'DESC' },
        take: limit,
        skip,
      },
    );

    return { transactions, total };
  }

  // Update transaction status
  async updateTransactionStatus(
    transactionId: string,
    status: 'pending' | 'completed' | 'failed',
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionId} not found`);
    }

    transaction.status = status;
    transaction.updatedAt = new Date();

    return this.transactionRepository.save(transaction);
  }
  async findOneByVendorId(vendorId: number) {
    const wallet_exist = await this.walletRepository.findOne({
      where: { vendor: { id: vendorId } },
    });
    if (!wallet_exist) {
      console.log('this vendor does not have wallet we will create one');
      const stripeAcc = await this.createWallet(vendorId);
      return stripeAcc.stripeAccountId;
    }
    return wallet_exist.stripeAccountId;
  }
  async findStripeAccountId(id: string) {
    const stripeAcc = await this.walletRepository.findOne({
      where: {
        stripeAccountId: id,
      },
    });
    if (!stripeAcc) {
      console.log('no stripe acc for this stripe acc id');
    }
    return stripeAcc;
  }
}
