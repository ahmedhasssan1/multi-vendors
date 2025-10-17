import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { bullmqProccessor } from './bullmq.proccessor';
import { EmailModule } from 'src/email/email.module';
import { bullmqService } from './bullmq.service';
import { emailVendor } from './processors/validation.proccessor';
// import { ValidateVendorProcessor } from './processors/validation.proccessor';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'email_queue',
        configKey: 'main_queue',
      },
      {
        name: 'handle_vendor',
        configKey: 'main_queue',
      },
    ),
    EmailModule,
  ],
  providers: [bullmqProccessor, bullmqService, emailVendor],
  exports: [bullmqService],
})
export class BullmqModule {}
