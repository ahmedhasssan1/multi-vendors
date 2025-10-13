import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CheckoutResponse {
  @Field(() => String)
  session_url: string;

  @Field(() => String)
  session_id?: string;
}