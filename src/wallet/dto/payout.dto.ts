import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";

@InputType()
export class PayoutDto{
    @Field()
    @IsNumber()
    vendorId:number

    @Field()
    @IsNumber()
    amount:number

    @Field()
    @IsString()
    description:string
}