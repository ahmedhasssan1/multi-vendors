import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { bullmqProccessor } from './bullmq.proccessor';
import { bullmqService } from './bullmq.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[
    BullModule.registerQueue({
      name:"email_queue",
      configKey:"main_queue2"
    }),
    EmailModule
  ],
  providers: [bullmqProccessor, bullmqService],
  exports:[bullmqService]
})
export class BullmqModule {}
