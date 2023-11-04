import { Controller } from '@nestjs/common';
import { userController } from "@shared/controllers/user.controller"
import { ControllerRequests } from "@packages/rest-typed/lib";

import { TypedRequest } from "@packages/rest-typed/nest"
import { UsersService } from "./users.service";
import { TypedEndpoint } from '@packages/rest-typed/nest/typed-endpoint';

type RequestType = ControllerRequests<typeof userController>

@Controller(userController.prefix)
export class UsersController {
  constructor(private userService: UsersService) {}

  @TypedEndpoint(userController.endpoints.getUser)
  async getUser(@TypedRequest() args: RequestType["getUser"]) {
    const user = this.userService.getUnique({ id: args.params.id })
    return user
  }
}
