import { PickType } from "@nestjs/mapped-types";
import { UsersModel } from "../users/users.model";

export class SignInDto extends PickType(UsersModel, ['login', "password"] as const) {}