import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { ClientDto } from './dto/client.dto';
import { Client } from 'src/clients/entity/client.entity';
import { ClientsService } from 'src/clients/clients.service';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import { VendorsService } from 'src/vendors/vendors.service';
import { userRole } from 'src/common/enum/role.enum';
import { SuperAdminService } from 'src/super-admin/super-admin.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private ClientService: ClientsService,
    private vendorService: VendorsService,
    private superAdminService: SuperAdminService,
    
  ) {}

  async generateToken() {}

  async register(userInput: UserDto): Promise<User> {
    const userExist = await this.userRepo.findOne({
      where: { email: userInput.email },
    });
    if (userExist) {
      throw new BadRequestException('this user already exist');
    }
    const { password, ...rest } = userInput;
    const hashed_password = await bcrypt.hash(password, 12);

    const new_user = this.userRepo.create({
      ...rest,
      password: hashed_password,
    });
    await this.userRepo.save(new_user);
    if (userInput.role == userRole.client) {
      await this.createClient({
        name: userInput.userName,
        email: userInput.email,
        password: hashed_password,
        user:new_user
      });
    } else if(userInput.role==userRole.vendor) {
      await this.createVendor({
        name: userInput.userName,
        email: userInput.email,
        password: hashed_password,
        user:new_user
      });
    }else{
      throw new UnauthorizedException("incoorect role")
    }
    return new_user
  }
  async createClient(clientInput: ClientDto): Promise<Client> {
    return await this.ClientService.createClient(clientInput);
  }
  async createVendor(vendorInput: ClientDto): Promise<Vendor> {
    return await this.vendorService.createVendor(vendorInput);
  }
  async findUserById(id: number): Promise<User> {
    const user_exist = await this.userRepo.findOne({ where: { id } });
    if (!user_exist) {
      throw new NotFoundException('no user exist with this id');
    }
    return user_exist;
  }
  async findUserByEmail(email: string): Promise<User> {
    const user_exist = await this.userRepo.findOne({ where: { email } });
    if (!user_exist) {
      throw new NotFoundException('no user exist with this email');
    }
    return user_exist;
  }
}
