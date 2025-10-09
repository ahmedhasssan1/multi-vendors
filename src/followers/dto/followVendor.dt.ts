import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FollowVendorDto {
  @Field()
  vendor_id: number;
}
    