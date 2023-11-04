import { UsersModel } from "../../server/src/users/users.model"
import { SignUpDto } from "../../server/src/auth/sign-up.dto";
import { SignInDto } from "../../server/src/auth/sign-in.dto";
import { createController } from "@packages/rest-typed/lib";

export const authController = createController({
  prefix: "auth",
  endpoints: {
    signUp: {
      method: "POST",
      path: "/sign-up",
      response: UsersModel,
      body: SignUpDto,
    },
    signIn: {
      method: "POST",
      path: "/sign-in",
      response: UsersModel,
      body: SignInDto,
    }
  }
})

const test = authController.endpoints.signIn

//type RequestType = ServerInferRequest<typeof userController.endpoints["createUser"]>["body"]
//const sas: TypeOrNever<typeof userController.endpoints["createUser"]["body"]> = {}