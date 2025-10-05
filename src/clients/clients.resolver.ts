import { Resolver } from '@nestjs/graphql';
import { ClientsService } from './clients.service';

@Resolver()
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}
}
