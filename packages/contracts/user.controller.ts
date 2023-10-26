import { GetResponsesData, initController } from "../rest-typed/lib"
import { userSchema } from "./user.schema";
import { UsersModel } from "../../server/src/users/users.model";
import { CreateUserDto } from "../../server/src/users/create-user.dto";

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
})

const sas = userController.endpoints.getUser

const test: GetResponsesData<typeof userController.endpoints.getUser> = {
  id: 2,
  name: "",
  age: 2,
  login: "",
  phone: ""
}