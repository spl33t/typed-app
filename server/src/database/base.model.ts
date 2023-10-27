import {
  AutoIncrement,
  Column,
  PrimaryKey,
  Table,
  Model,
  CreatedAt,
  UpdatedAt,
  ModelCtor,
  DataType,
  BeforeValidate,
} from 'sequelize-typescript';
import { ApiProperty } from "@nestjs/swagger";
import { Filterable } from 'sequelize/types/model';
import { validateClassByValues } from "@packages/utils/class-validator";
import { HttpStatus, HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

enum BRANDS_ENUM {
  UNIQUE = "UNIQUE",
  GENERATED = "GENERATED",
  OTHER = "OTHER",
}

export type Branded<Type, Brands extends Array<keyof typeof BRANDS_ENUM>> = Type & { [K in Brands[number]]?: true }

export type Generated<T> = Branded<T, [BRANDS_ENUM.GENERATED]>
//const testGenerated: Generated<Date> = new Date()
export type Unique<T> = Branded<T, [BRANDS_ENUM.UNIQUE]>
//const testUnique: Generated<string> = "l33t"
export type PrimaryKey<T> = Generated<T> & Unique<T>

//const testPrimaryKey: PrimaryKey<number> = 1337

type IsEqualBrand<B1, B2> = B1 extends B2 ? true : false
const testEqual: IsEqualBrand<PrimaryKey<unknown>, Generated<unknown>> = true
type BrandContains<T, Brand extends BRANDS_ENUM> = T extends Record<any, any> | Array<any> ? T[Brand] extends true ? true : false : false

type AnyFunction = (...args: any[]) => any;

type CommonExcludeAttributes = AnyFunction | Model | Model[] | BaseModel<any> | BaseModel<any>[]

export type InsertAttributes<M extends {}> = {
  [Key in keyof M as InsertAttributesKeys<M, Key>]: M[Key]
};

type InsertAttributesKeys<M extends {}, Key extends keyof M> =
  M[Key] extends CommonExcludeAttributes ? never :
    BrandContains<M[Key], BRANDS_ENUM.GENERATED> extends true ? never :
      Key extends keyof Model ? never
        : Key

export type UniqueAttributes<M extends {}> = {
  [Key in keyof M as UniqueAttributesKeys<M, Key>]: M[Key]
};

type UniqueAttributesKeys<M extends {}, Key extends keyof M> =
  M[Key] extends CommonExcludeAttributes ? never :
    BrandContains<M[Key], BRANDS_ENUM.UNIQUE> extends false ? never :
      Key extends keyof Omit<Model, "id"> ? never
        : Key

export type WithoutAssociationsAttributes<M extends {}> = {
  [Key in keyof M as WithoutAssociationsAttributesKeys<M, Key>]?: M[Key]
};

type WithoutAssociationsAttributesKeys<M extends {}, Key extends keyof M> =
  M[Key] extends CommonExcludeAttributes ? never :
    Key extends keyof Omit<Model, "id"> ? never
      : Key

export type AllAttributes<M extends {}> = {
  [Key in keyof M as AllAttributesKeys<M, Key>]?: M[Key]
};

type AllAttributesKeys<M extends {}, Key extends keyof M> =
  M[Key] extends AnyFunction ? never :
    Key extends keyof Omit<Model, "id" | "updatedAt" | "createdAt"> ? never
      : Key


@Table({ version: false })
export class BaseModel<TModelAttributes extends {}>
  extends Model<AllAttributes<TModelAttributes>, InsertAttributes<TModelAttributes>> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: PrimaryKey<number>

  @ApiProperty({ type: Date })
  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt: Generated<Date>;

  @ApiProperty({ type: Date })
  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt: Generated<Date>;

  @BeforeValidate
  static async beforeValidateHook(instance: BaseModel<any>, options: any) {
    const modelName = this.name
    const values = instance.dataValues
    const model: any = new this()

    for (const key in values) {
      model[key] = values[key]
    }

    const errors = await validateClassByValues(model, values)
    if (errors.length > 0) {
      console.log(`Validation failed by class-validator in model ${modelName}`, errors)
      throw new HttpException(errors, HttpStatus.BAD_REQUEST)
    }

    //Transform values
    //TODO: В валидации req так же есть трансформация, поэтому она выполнятьеся два раза. При кейсе умножения или конкатенации будет весело
    // Если получится затащаить init стейт req тогда можно будет сравнить проводилась ли трнасформация
    // иначе трансформацию оставить только в одном месте
    // но с другой строны это логично, словил двноную контатенацию из того что DTO  нследована от модели
    instance.dataValues = plainToInstance(this, values).dataValues
  }

  static async unique<M extends BaseModel<any>>
  (this: ModelCtor<M>, values?: UniqueAttributes<M>) {
    return await this.findOne({ where: values as Filterable["where"] })
  }

  static async all<M extends BaseModel<any>>
  (this: ModelCtor<M>, where?: WithoutAssociationsAttributes<M>) {
    return await this.findAll({ where: where as Filterable["where"] })
  }

  static async put<M extends BaseModel<any>>
  (this: ModelCtor<M>, where: UniqueAttributes<M>, values?: Partial<InsertAttributes<M>>) {
    // @ts-ignore
    return await this.update(values as any, { where: where as Filterable["where"] })
  }

  static async delete<M extends BaseModel<any>>
  (this: ModelCtor<M>, where: UniqueAttributes<M>) {
    return await this.destroy({ where: where as Filterable["where"] })
  }
}

