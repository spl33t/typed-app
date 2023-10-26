import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectsModel } from "./projects.model";

@Module({
  imports: [SequelizeModule.forFeature([ProjectsModel])],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule {}