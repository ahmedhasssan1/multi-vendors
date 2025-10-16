import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { bullmqProccessor } from './bullmq.proccessor';
import { bullmqService } from './bullmq.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[
    BullModule.registerQueue({
      name:"email_queue",
      configKey:"main_queue"
    }),
    EmailModule
  ],
  providers: [bullmqProccessor, bullmqService],
})
export class BullmqModule {}
