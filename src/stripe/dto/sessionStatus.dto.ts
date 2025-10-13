// stripe.types.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SessionStatusResult {
  @Field(() => String, { nullable: true })
  charge_id?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  customer_email?: string;

  @Field(() => Number, { nullable: true })
  amount_total?: number;
}