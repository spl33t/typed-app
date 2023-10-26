import { Controller } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { userController } from "@packages/contracts/user.controller"
import { ControllerRequests, ServerInferRequest } from "@packages/rest-typed/lib";

import { TypedRequest, TypedEndpoint } from "@packages/rest-typed/nest"
import { UsersModel } from "./users.model";


type RequestType = ControllerRequests<typeof userController>

export function name(data: any): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    const names = Reflect.getOwnMetadata('fields', target) || [];
    if (!names.includes(propertyKey)) {
      names.push(propertyKey)
    }
    Reflect.defineMetadata("names", data, target)
    console.log(Object.getOwnPropertyNames(target))
    //console.log(Reflect.getMetadata("qwe", target))
  }
}

@Controller(userController.prefix)
export class UsersController {

  constructor(@InjectModel(UsersModel) private userRepository: typeof UsersModel) {}

  @TypedEndpoint(userController.endpoints.getUser)
  async getUser(@TypedRequest() args: RequestType["getUser"]) {
    const user = this.userRepository.findOne({ where: { id: args.params.id } })
    return user
  }

  @TypedEndpoint(userController.endpoints.createUser)
  async createUser(@TypedRequest() args: RequestType["createUser"]) {

    const user = await this.userRepository.create({ ...args.body })
    return user
  }
}
