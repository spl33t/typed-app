import { initController, ServerInferRequest } from "@packages/rest-typed"
import { CreateUserDto } from "../server/src/users/create-user.dto"
import { UsersModel } from "../server/src/users/users.model"

export const userController = initController({
  prefix: "users",
  endpoints: {
    getUser: {
      method: "GET",
      path: "/:id",
      response: UsersModel,
    },
    createUser: {
      method: "POST",
      path: "/",
      response: UsersModel,
      body: CreateUserDto
    }
  }
} )


const s: typeof userController.endpoints.createUser.body.prototype = {
  password: "",
  login: "",
  phone: ""
}

type RequestType = ServerInferRequest<typeof userController.endpoints["createUser"]>["body"]
//const sas: TypeOrNever<typeof userController.endpoints["createUser"]["body"]> = {}