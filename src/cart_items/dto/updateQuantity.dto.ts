import { Field, InputType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";
import {Request} from "express"
@InputType()
export class QuantityDto{

    @Field()
    @IsNumber()
    quantity:number

    @Field()
    @IsNumber()
    product_id:number


}