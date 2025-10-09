import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { userRole } from "../enum/role.enum";

@Injectable()
export class  clientGuard implements CanActivate{
    constructor(private jwtService:JwtService,
        private configService:ConfigService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean>   {
        const ctx=GqlExecutionContext.create(context);
        const request=ctx.getContext().req;
        const token=request.cookies.access_token;
        const decode= await this.jwtService.verifyAsync(token,{
            secret:this.configService.get<string>('JWT_SECRET')
        })
        if(!decode?.role){
            throw new UnauthorizedException("there is user not allowed or need to login")
        }
        if(decode.role==userRole.client){
            return true
        }
        return false
    }
}