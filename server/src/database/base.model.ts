import {
  AutoIncrement,
  Column,
  PrimaryKey,
  Table,
  Model,
  CreatedAt,
  UpdatedAt,
  ModelStatic,
  ModelCtor,
} from 'sequelize-typescript';
import { ApiProperty } from "@nestjs/swagger";
import { Filterable } from 'sequelize/types/model';

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

type CommonExcludeAttributes = AnyFunction | Model | Model[]

export type InsertAttributes<M extends {}> = {
  [Key in keyof M as InsertAttributesKeys<M, Key>]: M[Key]
};

type InsertAttributesKeys<M extends {}, Key extends keyof M> =
  M[Key] extends CommonExcludeAttributes ? never :
    BrandContains<M[Key], BRANDS_ENUM.GENERATED> extends true ? never :
      Key extends keyof Model ? never
        : Key

export type OneAttributes<M extends {}> = {
  [Key in keyof M as OneAttributesKeys<M, Key>]: M[Key]
};

type OneAttributesKeys<M extends {}, Key extends keyof M> =
  M[Key] extends CommonExcludeAttributes ? never :
    BrandContains<M[Key], BRANDS_ENUM.UNIQUE> extends false ? never :
      Key extends keyof Omit<Model, "id"> ? never
        : Key

export type AllAttributes<M extends {}> = {
  [Key in keyof M as AllAttributesKeys<M, Key>]?: M[Key]
};

type AllAttributesKeys<M extends {}, Key extends keyof M> =
  M[Key] extends CommonExcludeAttributes ? never :
    Key extends keyof Omit<Model, "id"> ? never
      : Key


@Table({ version: false })
export class BaseModel<TModelAttributes extends {} = {}, TCreationAttributes extends {} = TModelAttributes>
  extends Model<TModelAttributes, TCreationAttributes> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: PrimaryKey<number>

  @ApiProperty({ type: Date })
  @CreatedAt
  @Column
  createdAt: Generated<Date>;

  @ApiProperty({ type: Date })
  @UpdatedAt
  @Column
  updatedAt: Generated<Date>;

  static async insert<M extends BaseModel>
  (this: ModelCtor<M>, values?: InsertAttributes<M>,) {
    return await this.create(values as any)
  }

  static async one<M extends BaseModel>
  (this: ModelCtor<M>, values?: OneAttributes<M>) {
    return await this.findOne({ where: values as Filterable["where"] })
  }

  static async all<M extends BaseModel>
  (this: ModelCtor<M>, where?: AllAttributes<M>) {
    return await this.findOne({ where: where as Filterable["where"] })
  }

  static async put<M extends BaseModel>
  (this: ModelCtor<M>, where: OneAttributes<M>, values?: Partial<InsertAttributes<M>>) {
    return await this.update(values as any, { where: where as Filterable["where"] })
  }

  static async delete<M extends BaseModel>
  (this: ModelCtor<M>, where: OneAttributes<M>) {
    return await this.destroy({ where: where as Filterable["where"] })
  }
}