import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, NotFoundException } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from 'src/email/email.service';

@Processor('handle_vendor')
export class emailVendor extends WorkerHost {
  private readonly logger = new Logger(emailVendor.name);
  private isRunning = false;
  constructor(private emailService: EmailService) {
    super();
  }
  async process(job: Job<{ email: string }>): Promise<any> {
    this.logger.log(`job started ${job.name}`);

    this.isRunning = true;
    this.logger.log(`Job started: ${job.name}`);
    try {
      if (job.name == 'vandor') {
        const { email } = job.data;
        if (!email) {
          this.logger.error('Recipient is missing!');
          return;
        }
        await this.emailService.sendVendorEmail(email);
        this.logger.log('email sent successfully to vendor');
      }
    } catch (err) {
      this.logger.log('can not send email to vendor ');
    } finally {
      this.isRunning = false;
    }
  }
}
