import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class Sendemaildto {
  @IsEmail({}, { each: true })
  @Field(() => [String])
  recipienst: string[];

  @IsString()
  @Field()
  subject: string;

  @IsString()
  @Field()
  html: string;

  @IsOptional()
  @IsString()
  @Field()
  text?: string;
}
