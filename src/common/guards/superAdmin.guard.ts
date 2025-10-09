// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Observable } from 'rxjs';

// @Injectable()
// export class superAdmin implements CanActivate {
//   constructor(private jwtSerrvice: JwtService) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();

//     const cokkies = request.cookies;
//     const Token = cokkies['access_token'];
//     if (!Token) return false;
//     const decode = await this.jwtSerrvice.decode(Token);
//     if (decode.role == 'superAdmin') {
//       return true;
//     }
//     return false;
//   }
// }
