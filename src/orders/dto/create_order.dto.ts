import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";

@InputType()
export class OrderDto{
    @Field()
    @IsString()
    order_status:string

    @Field()
    @IsNumber()
    total:number
    
    @Field()
    @IsString()
    shipping_addres:string

    @Field()
    @IsString()
    payment_method:string
    

}   