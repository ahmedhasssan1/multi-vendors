import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entity/client.entity';
import { Repository } from 'typeorm';
import { ClientDto } from 'src/users/dto/client.dto';

@Injectable()
export class ClientsService {
    constructor(@InjectRepository(Client) private ClientRepo:Repository<Client>){}
    async createClient(clientInput:ClientDto):Promise<Client>{
    const clientExist= await this.ClientRepo.findOne({where:{email:clientInput.email}});
    if(clientExist){
        throw new NotFoundException("this client email exist")
    }
    const client=this.ClientRepo.create(clientInput);
    await this.ClientRepo.save(client);
    return client
  }
}
