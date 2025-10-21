import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class commentDto {
  @Field(() => Int)
  @IsNumber()
  product_id: number;

  @Field(() => String)
  @IsString()
  constent: string;


}
