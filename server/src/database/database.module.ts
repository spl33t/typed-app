import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection, SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from "../users/users.model";
import * as seq from 'sequelize-typescript';
import { ProjectsModel } from "../projects/projects.model";
import { CategoryModel } from "../category/category.model";

const models = [UsersModel, ProjectsModel, CategoryModel]

const forFeatureModels = SequelizeModule.forFeature(models);

@Global()
@Module({
  imports: [ConfigModule, SequelizeModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return {
        dialect: 'postgres',
        host: configService.get("POSTGRES_HOST"),
        port: Number(configService.get("POSTGRES_PORT")),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        database: configService.get("POSTGRES_DB"),
        models,
        synchronize: true,
        autoLoadModels: true,
        logging: false,
        sync: { force: true }
      }
    },
  }), forFeatureModels],
  exports: [forFeatureModels]
})
export class DatabaseModule {
  constructor(@InjectConnection() private connection: seq.Sequelize) {}
}
