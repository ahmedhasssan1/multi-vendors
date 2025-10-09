import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperAdmin } from './entity/superAdmin.entity';
import { Repository } from 'typeorm';
import { superAdmindto } from './dto/superAdmin.dto';
import * as bcrypt from "bcrypt"

@Injectable()
export class SuperAdminService {
    constructor(@InjectRepository(SuperAdmin) private SuperAdminRepo:Repository<SuperAdmin>){}

    async createSuperAdmin(superAdminInput:superAdmindto):Promise<SuperAdmin>{
        const super_admin=await this.SuperAdminRepo.findOne({where:{email:superAdminInput.email}});

        if(super_admin){
            throw new UnauthorizedException('this super admin already exist');
        }
        const new_superadmin=this.SuperAdminRepo.create(superAdminInput);
        return await this.SuperAdminRepo.save(new_superadmin);
    }
    async findSuperAdmin(email:string):Promise<SuperAdmin>{
        const find_SuperAdmin=await this.SuperAdminRepo.findOne({where:{email}});
        if(!find_SuperAdmin){
            throw new NotFoundException("this suepr admin not exist in super admin table")
        }
        return find_SuperAdmin
    }
}
