import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class Sendemaildto {
  @IsEmail({}, { each: true })
  @Field(() => String)
  recipient: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  orderId?: string;
}
