import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CartItemDto {
  @Field()
  product_id: number;

  @Field()
  quantity: number;
}
