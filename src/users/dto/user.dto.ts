import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString } from "class-validator";
import { userRole } from "src/common/enum/role.enum";

@InputType()
export class UserDto{
    @Field()
    @IsString()
    userName:string

    @Field()
    @IsEmail()
    
    email:string

    @Field()
    @IsString()
    password:string

    @Field()
    role:userRole


}