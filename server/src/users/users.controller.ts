import { Controller } from '@nestjs/common';
import { userController } from "@shared/user.controller"
import { ControllerRequests } from "@packages/rest-typed/lib";

import { TypedRequest, TypedEndpoint } from "@packages/rest-typed/nest"
import { UsersService } from "./users.service";

type RequestType = ControllerRequests<typeof userController>

@Controller(userController.prefix)
export class UsersController {
  constructor(private userService: UsersService) {}

  @TypedEndpoint(userController.endpoints.getUser)
  async getUser(@TypedRequest() args: RequestType["getUser"]) {
    const user = this.userService.getUnique({ id: args.params.id })
    return user
  }

  @TypedEndpoint(userController.endpoints.createUser)
  async createUser(@TypedRequest() args: RequestType["createUser"]) {
    const user = await this.userService.create({ ...args.body })
    return user
  }
}
