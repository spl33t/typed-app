
import { PickType } from "@nestjs/mapped-types";
import { UsersModel } from "../users/users.model";

export class SignUpDto extends PickType(UsersModel, ['login', "password", "phone", "role"] as const)  {

}