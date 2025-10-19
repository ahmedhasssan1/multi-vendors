import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ReviewDto {
  @Field(() => String)
  @IsString()
  content: string;

  @Field(()=>Float)
  rating:number

  @Field(()=>Int)
  client_id:number

  @Field(()=>Int)
  vendor_id:number

}
