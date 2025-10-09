import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { FollowersService } from './followers.service';
import { FollowVendorDto } from './dto/followVendor.dt';
import { Followers } from './entity/followers.enity';
import { UseGuards } from '@nestjs/common';
import { clientGuard } from 'src/common/guards/client.guard';
import {Request} from "express"
@Resolver()
export class FollowersResolver {
  constructor(private readonly followersService: FollowersService) {}

  @Mutation(() => Followers)
  @UseGuards(clientGuard)
  async followVendor(@Args('followInput') followInput: FollowVendorDto,@Context() ctx:{req:Request}) {
    return await this.followersService.followVendor(followInput,ctx.req);
  }
}
