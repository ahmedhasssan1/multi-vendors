import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class SessionStatusType {
  @Field(() => ID)
  id: string;
  
  @Field()
  status: string;
  
  @Field()
  paymentStatus: string;
  
  @Field()
  amountTotal: number;
  
  @Field()
  currency: string;
  
  @Field({ nullable: true })
  customerEmail?: string;
  

  
  @Field()
  createdAt: Date;
}