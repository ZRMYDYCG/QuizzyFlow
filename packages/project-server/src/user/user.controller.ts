import { Controller, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { HttpException, HttpStatus } from '@nestjs/common'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async register(@Body() user: CreateUserDto) {
    try {
      return await this.userService.create(user)
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY)
    }
  }
}
