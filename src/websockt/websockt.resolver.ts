import { Resolver } from '@nestjs/graphql';
import { WebsocktService } from './websockt.service';

@Resolver()
export class WebsocktResolver {
  constructor(private readonly websocktService: WebsocktService) {}
}
