import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from './users.model';
import { ProjectsModel } from "../projects/projects.model";
import { InsertAttributes } from "../database/base.model";
import { CreateUserDto } from "./create-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(UsersModel) private userRepository: typeof UsersModel,
              @InjectModel(ProjectsModel) private projectRepository: typeof ProjectsModel) {}

  async insert(dto: CreateUserDto) {
    const s = await this.userRepository.insert({ ...dto })
    return s
  }

  //todo: extend by queryController
  async one() {
    const s = await this.userRepository.one({ id: 2 })
    return s
  }

  async all() {
    const s = await this.userRepository.all({ id: 2 })
  }

  async update() {
    const s = await this.userRepository.put({id: 1}, {})
  }

  async delete() {
    const s = await this.userRepository.delete({ id: 2 })
  }

}
