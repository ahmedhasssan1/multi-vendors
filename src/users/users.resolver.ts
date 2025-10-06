import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(()=>User)
  async signup(@Args('userInfo')userInput:UserDto){
    return await this.usersService.register(userInput);
  }
}
