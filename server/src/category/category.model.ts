import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

import { Column, DataType, Table, HasMany } from "sequelize-typescript";
import { BaseModel, Unique} from "../database/base.model";
import { ProjectsModel } from "../projects/projects.model";

@Table({ tableName: 'category', })
export class CategoryModel extends BaseModel<CategoryModel> {
  @ApiProperty({ example: "YOBA", description: 'Название категории' })
  @IsString()
  @IsOptional()
  @Column({ type: DataType.STRING, unique: true })
  name?: Unique<string>

  @ApiProperty({ readOnly: true, type: () => ProjectsModel, description: 'Проект' })
  @HasMany(() => ProjectsModel)
  projects: ProjectsModel[]
}
