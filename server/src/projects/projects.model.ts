import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

import { Column, DataType, Table, BelongsTo, ForeignKey } from "sequelize-typescript";
import { AllAttributes, BaseModel, InsertAttributes, Unique, UniqueAttributes } from "../database/base.model";
import { UsersModel } from "../users/users.model";

@Table({ tableName: 'projects', })
export class ProjectsModel extends BaseModel<ProjectsModel> {
  @ApiProperty({ example: "YOBA", description: 'Название проекта' })
  @IsString()
  @IsOptional()
  @Column({ type: DataType.STRING, unique: true })
  name?: Unique<string>

  @ApiProperty({ example: 1, description: 'Уникальный индитефикатор юзера' })
  @ForeignKey(() => UsersModel)
  @Column({ type: DataType.INTEGER, allowNull: false, validate: { notEmpty: true } })
  userId?: number

  @ApiProperty({ readOnly: true, type: () => UsersModel, description: 'Юзер' })
  @BelongsTo(() => UsersModel)
  user: UsersModel
}

type TestInsertAttributes = InsertAttributes<ProjectsModel>
const testInsert: TestInsertAttributes = {}
type TestOneAttributes = UniqueAttributes<ProjectsModel>
const testOne: TestOneAttributes = { id: 2 }
type TestAllAttributes = AllAttributes<ProjectsModel>
const testAll: TestAllAttributes = { id: 2 }
