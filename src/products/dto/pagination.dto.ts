import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@InputType()
export class PaginationDto{
    @Field(()=>Int,{defaultValue:1})
    page:number

    @Field(()=>Int,{defaultValue:2})
    limit:number

    @Field()
    @IsString()
    @IsOptional()
    category?:string
}