import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TokenService } from "./token.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private tokenService: TokenService,
              private userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const token = this.getToken(request);
    const payload = await this.tokenService.verify(token);
    if(!payload) {
      throw new HttpException("Ключ доступа невалиден", HttpStatus.FORBIDDEN)
    }
    const user = await this.userService.getUnique({ id: payload?.id })

    if (user) {
      request.user = user;
      return true;
    } else {
      throw new HttpException("Пользователь не зарегистрирован в системе", HttpStatus.FORBIDDEN)
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