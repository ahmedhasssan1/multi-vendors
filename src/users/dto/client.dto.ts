import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
import { userRole } from 'src/common/enum/role.enum';
import { User } from '../entity/user.entity';

@InputType()
export class ClientDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  user:User

  @Field()
  @IsString()
  password: string;
}
