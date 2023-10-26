import { PickType } from "@nestjs/mapped-types";
import { UsersModel } from "./users.model";
import { InsertAttributes } from "../database/base.model";

export class CreateUserDto extends PickType(UsersModel, ['login', "password", "name", "age", "phone"] as const)
  implements InsertAttributes<UsersModel> {}


