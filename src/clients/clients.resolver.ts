import { Resolver } from '@nestjs/graphql';
import { ClientsService } from './clients.service';
import { ClientDto } from 'src/users/dto/client.dto';
import { Client } from './entity/client.entity';

@Resolver()
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

}
