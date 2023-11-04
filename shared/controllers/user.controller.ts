import { UsersModel } from "../../server/src/users/users.model"
import { createController } from "@packages/rest-typed/lib";

export const userController = createController({
  prefix: "users",
  endpoints: {
    getUser: {
      method: "GET",
      path: "/:id",
      response: UsersModel,
    },
  }
})

const test = userController.endpoints

//type RequestType = ServerInferRequest<typeof userController.endpoints["createUser"]>["body"]
//const sas: TypeOrNever<typeof userController.endpoints["createUser"]["body"]> = {}