import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import { Wallet } from "../entity/wallet.entity";

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

      @Field()
    @IsString()
    stripeAccount:string

}