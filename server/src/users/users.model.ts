import {
  Column,
  DataType,
  Table,
  HasMany

} from "sequelize-typescript"
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { BaseModel, InsertAttributes } from "src/database/base.model";
import { ProjectsModel } from "../projects/projects.model";

type TestInfer = InsertAttributes<UsersModel>

@Table({ tableName: 'users', })
export class UsersModel extends BaseModel<UsersModel> {
  @ApiProperty({ example: "spl33t", description: 'Логин', required: true })
  @IsString()
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  login: string

  @ApiProperty({ example: "spl33t", description: 'Пароль', required: true })
  @IsString()
  @Column({ type: DataType.STRING, allowNull: false })
  password: string

  @ApiProperty({ example: "+7 (977) 270 84-78", description: 'Телефон', required: true })
  @IsString()
  @Transform((params) => params.value + "transform-is-work")
  @Column({ type: DataType.STRING, allowNull: false, })
  phone: string

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

  @ApiProperty({
    readOnly: true,
    isArray: true,
    type: ProjectsModel,
    description: 'Проекты'
  })
  @HasMany(() => ProjectsModel)
  projects: ProjectsModel[]
}