import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/user.schemas'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel) {}

  async create(user) {
    const createdUser = new this.userModel(user)
    return await createdUser.save()
  }

  async findOne(username: string, password: string) {
    return await this.userModel.findOne({ username, password })
  }
}
