import { Field, InputType, Int } from "@nestjs/graphql";
import {Request} from "express"
@InputType()
export class UpdateProductInput {
  @Field(() => Int)
  product_id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  stock?: number;

  @Field()
  req:Request
}
