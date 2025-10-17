import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class bullmqService {
  private readonly logger = new Logger(bullmqService.name);

  constructor(
    @InjectQueue('email_queue') private readonly emailQueue: Queue,
    @InjectQueue('handle_vendor') private readonly vendorQueue: Queue,
  ) {}

  async handleEmailSending(recipient: string, orderId: string) {
    await this.logger.log('Adding email job to queue...');
    console.log('debugging email ', recipient);

    try {
      await this.emailQueue.add(
        'send-email',
        {
          recipient,
          orderId,
        },
        { removeOnComplete: true, removeOnFail: 100, delay: 3000 },
      );
      this.logger.log('email job added to BullMQ queue successfully!');
    } catch (error) {
      this.logger.error(' Failed to add job to queue!', error.stack);
    }
  }

  async handleVendor(email: string) {
    this.logger.log(`Adding vendor email job to queue for: ${email}`);

    try {
      await this.vendorQueue.add(
        'vandor',
        { email },
        { removeOnComplete: true, removeOnFail: 10, delay: 3000 },
      );
      this.logger.log('Vendor email job added to queue successfully!');
    } catch (error) {
      this.logger.error(
        'Failed to add vendor email job to queue!',
        error.stack,
      );
    }
  }
}
