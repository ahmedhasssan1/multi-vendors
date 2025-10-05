import { Resolver } from '@nestjs/graphql';
import { FollowersService } from './followers.service';

@Resolver()
export class FollowersResolver {
  constructor(private readonly followersService: FollowersService) {}
}
