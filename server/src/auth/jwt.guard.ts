import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TokenService } from "./token.service";


@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject("TokenService") private tokenService : TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const token = this.getToken(request);
    const payload = await this.tokenService.verify(token);
 /*   const user = await this.userService.getUnique({ id: payload?.id })*/

    if (payload) {
      request.user = payload;
      return true;
    } else {
      throw new HttpException("Ключ доступа невалиден", HttpStatus.FORBIDDEN)
    }
  }

  protected getToken(request: any): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    const [_, token] = authorization.split(' ');
    return token;
  }
}