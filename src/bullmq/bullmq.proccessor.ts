import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from 'src/email/email.service';

@Processor('email_queue')
export class bullmqProccessor extends WorkerHost {
  private readonly logger = new Logger(bullmqProccessor.name);
  private isRunning = false;

  constructor(
    private emailService:EmailService
  ) {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    if (this.isRunning) {
      this.logger.warn(`Skipping ${job.name} — previous job still running.`);
      return;
    }

    this.isRunning = true;
    this.logger.log(`Job started: ${job.name}`);

    try {
      if (job.name === 'send-email') {
    
        this.logger.log(' email Executed Successfully!');
      }
    } catch (error) {
      this.logger.error(`Job failed: ${job.name}`, error.stack);
    } finally {
      this.isRunning = false; // Always unlock the job processor
    }
  }
}
