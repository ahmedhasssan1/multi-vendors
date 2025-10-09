import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class VendorGuard implements CanActivate{
    constructor(private jwtservice:JwtService,
        private configservice:ConfigService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const ctx=GqlExecutionContext.create(context);
        const request=ctx.getContext().req;
        const token =request.cookies?.access_token;

        const decode=await this.jwtservice.verifyAsync(token,{
            secret:this.configservice.get<string>('JWT_SECRET')
        });
        if(!decode){
            throw new BadRequestException("no access token ");
        }
        const role=decode.role;
        if(role!="vendor"){
            return false
        }
        return true;


    }
}