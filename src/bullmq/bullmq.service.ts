import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class bullmqService {
  private readonly logger = new Logger(bullmqService.name);

  constructor(@InjectQueue('email_queue') private readonly emailQueue: Queue) {}

  async handleEmailSending() {
    this.logger.log('⏳ Adding email job to queue...');

    try {
      await this.emailQueue.add(
        'send-email',
        {},
        { removeOnComplete: true, removeOnFail: 100 },
      );
      this.logger.log('email job added to BullMQ queue successfully!');
    } catch (error) {
      this.logger.error(' Failed to add job to queue!', error.stack);
    }
  }
}
