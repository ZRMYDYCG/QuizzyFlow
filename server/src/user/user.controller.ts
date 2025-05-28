import { Controller, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { HttpException, HttpStatus } from '@nestjs/common'
import { Public } from '../auth/decorators/public.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Post('register')
  async register(@Body() user: CreateUserDto) {
    try {
      return await this.userService.create(user)
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY)
    }
  }
}
