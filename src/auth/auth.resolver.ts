import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user.login';
import  {Request} from 'express'
import  {Response} from 'express'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  
  @Mutation(()=>String)
  async login(@Args("userData")userInput:UserLoginDto,@Context() Context){
     const res= await this.authService.login(userInput,Context.res);
     return res;
  }
}
