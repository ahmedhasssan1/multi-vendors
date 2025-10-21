import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entity/client.entity';
import { Repository } from 'typeorm';
import { ClientDto } from 'src/users/dto/client.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private ClientRepo: Repository<Client>,
    private readonly jwtservice:JwtService,
    private readonly configService:ConfigService
  ) {}

  async decode(code: string) {
    const token = await this.jwtservice.verifyAsync(code, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return token;
  }

  async createClient(clientInput: ClientDto): Promise<Client> {
    const clientExist = await this.ClientRepo.findOne({
      where: { email: clientInput.email },
    });
    if (clientExist) {
      throw new NotFoundException('this client email exist');
    }
    const client = this.ClientRepo.create(clientInput);
    await this.ClientRepo.save(client);
    return client;
  }
  async findClientById(clientId: number): Promise<Client> {
    const client_exist = await this.ClientRepo.findOne({
      where: { id: clientId },
    });
    if (!client_exist) {
      throw new NotFoundException('this cleint not exist');
    }
    return client_exist;
  }
  async findUserByEmail(email: string): Promise<Client> {
    const client = await this.ClientRepo.findOne({ where: { email } });
    if (!client) {
      throw new NotFoundException('this client not found ');
    }
    return client;
  }
  async findClientByUserId(id: number): Promise<Client> {
    const client = await this.ClientRepo.findOne({
      where: {
        user: { id },
      },
    });
    if (!client) {
      throw new NotFoundException('there is no  client with this  user id');
    }
    return client;
  }
}
