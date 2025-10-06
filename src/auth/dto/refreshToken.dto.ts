import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RefreshTokenDto{
    @Field()
    user_id:number

    @Field()
    role:string
}