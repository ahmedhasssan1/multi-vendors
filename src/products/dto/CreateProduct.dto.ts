import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class ProductDto{
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNumber()
  vendor_id: number;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  category: string;

  @Field()
  @IsNumber()
  price: number;

  @Field()
  @IsNumber()
  quantity: number;
}
