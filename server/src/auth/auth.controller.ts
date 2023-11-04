import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { TypedRequest } from "@packages/rest-typed";
import { ControllerRequests } from "@packages/rest-typed/lib";
import { authController } from "@shared/controllers/auth.controller";
import { UsersService } from "../users/users.service";
import { TypedEndpoint } from "@packages/rest-typed/nest/typed-endpoint";
import { TokenService } from "./token.service";

type RequestType = ControllerRequests<typeof authController>

@Controller(authController.prefix)
export class AuthController {
  constructor(private userService: UsersService,
              private tokenService: TokenService) {}

  @TypedEndpoint(authController.endpoints.signUp)
  async signUp(@TypedRequest() args: any/*RequestType["signUp"]*/) {
    const user = await this.userService.create(args.body)
    const token = this.tokenService.sign(user)
    return { user, token }
  }

  @TypedEndpoint(authController.endpoints.signIn)
  async signIn(@TypedRequest() args: /*RequestType["signIn"]*/any) {
    const user = await this.userService.getUnique({ login: args.body.login })

    if (user) {
      let passwordMatch = user?.password === args.body.password

      if (!passwordMatch) throw new HttpException("Неверный пароль или логин", HttpStatus.BAD_REQUEST)

      const token = this.tokenService.sign(user)

      return { user, token }
    } else {
      throw new HttpException("Неверный пароль или логин", HttpStatus.BAD_REQUEST)
    }
  }
}
