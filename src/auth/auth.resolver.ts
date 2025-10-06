import { Args, CONTEXT, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user.login';
import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { IS_PUBLIC, Public } from './guard/jwtGuard';


@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  
  @Public()
  @Mutation(()=>String)
  async login(@Args("userData")userInput:UserLoginDto,@Context() Context){
     const res= await this.authService.login(userInput,Context.res);
     return res;
  }

  @Mutation(()=>String)
   async logout(@Context() Context){
    const token= Context.req.cookies?.access_token
    if(!token){
      throw new BadRequestException("no accces token")
    }
    await  this.authService.logout(token,Context.res);
    return "this user logged out"
  }
}
