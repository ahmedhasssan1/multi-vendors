import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailResolver } from './email.resolver';

@Module({
  providers: [EmailResolver, EmailService],
})
export class EmailModule {}
