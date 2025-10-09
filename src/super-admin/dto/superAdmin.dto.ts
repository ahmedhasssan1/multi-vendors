import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class superAdmindto{
    @Field()
    @IsString()
    name:string

    @Field()
    @IsString()
    password:string

    @Field()
    @IsString()
    email:string


}