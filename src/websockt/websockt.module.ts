import { Module } from '@nestjs/common';
import { WebsocktService } from './websockt.service';
import { WebsocktResolver } from './websockt.resolver';

@Module({
  providers: [WebsocktResolver, WebsocktService],
})
export class WebsocktModule {}
