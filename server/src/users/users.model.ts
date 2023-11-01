import {
  Column,
  DataType,
  Table,
  HasMany

} from "sequelize-typescript"
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseModel, Unique } from "../database/base.model";
import { ProjectsModel } from "../projects/projects.model";

export enum UserRoleEnum {
  ROOT = "ROOT",
  ADMIN = "ADMIN",
  DISPATCHER = "DISPATCHER",
}

@Table({ tableName: 'users', })
export class UsersModel extends BaseModel<UsersModel> {
  @ApiProperty({ example: "spl33t", description: 'Логин', required: true })
  @IsString()
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  login: Unique<string>

  @ApiProperty({ example: "spl33t", description: 'Пароль', required: true })
  @IsString()
  @Column({ type: DataType.STRING, allowNull: false })
  password: string

  @ApiProperty({ example: "+7 (977) 270 84-78", description: 'Телефон', required: true })
  @IsString()
  @Transform((params) => params.value + "transform-is-work")
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  phone: Unique<string>

  @ApiProperty({ example: "Юра Клюжев", description: 'Имя' })
  @IsString()
  @IsOptional()
  @Column({ type: DataType.STRING, })
  name?: string

  @ApiProperty({ example: "1337", description: 'Возраст' })
  @IsNumber()
  @IsOptional()
  @Column({ type: DataType.INTEGER, })
  age?: number

  @ApiProperty({ enum: UserRoleEnum, example: "1337", description: 'Роль' })
  @IsEnum(UserRoleEnum)
  @Column({ type: DataType.ENUM(...Object.values(UserRoleEnum)), })
  role: typeof UserRoleEnum

  @ApiProperty({
    readOnly: true,
    isArray: true,
    type: ProjectsModel,
    description: 'Проекты'
  })
  @HasMany(() => ProjectsModel)
  projects: ProjectsModel[]
}
