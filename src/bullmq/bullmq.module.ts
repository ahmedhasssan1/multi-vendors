import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { bullmqProccessor } from './bullmq.proccessor';
import { bullmqService } from './bullmq.service';

@Module({
  imports:[
    BullModule.registerQueue({
      name:"email_queue",
      configKey:"main_queue"
    })
  ],
  providers: [bullmqProccessor, bullmqService],
})
export class BullmqModule {}
