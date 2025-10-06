import { Field, InputType } from "@nestjs/graphql"
import { IsNumber, IsString } from "class-validator"

@InputType()
export class payloadDto{
    @Field()
    @IsNumber()
    sub:number
    
    @Field()
    @IsString()
    email:string

    @Field()
    @IsString()
    role:string
}