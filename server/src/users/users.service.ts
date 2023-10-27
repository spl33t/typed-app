import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from './users.model';
import { CreateUserDto } from "./create-user.dto";
import { UniqueAttributes } from "../database/base.model";

@Injectable()
export class UsersService {
  constructor(@InjectModel(UsersModel) private userRepository: typeof UsersModel,) {}

  async create(dto: CreateUserDto) {
      const s = await this.userRepository.create({ ...dto })
      return s

  }

  //todo: extend by queryController
  async getUnique(where: UniqueAttributes<UsersModel>) {
    const s = await this.userRepository.unique(where)
    return s
  }

  async getAll() {
    const s = await this.userRepository.all({ id: 2 })
  }

  async update() {
    const s = await this.userRepository.put({ id: 1 }, {})
  }

  async delete() {
    const s = await this.userRepository.delete({ id: 2 })
  }
}
