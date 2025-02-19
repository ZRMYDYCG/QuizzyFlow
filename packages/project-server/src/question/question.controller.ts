import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common'
import { QuestionDto } from './dto/question.dto'
import { QuestionService } from './question.service'

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('isDeleted') isDeleted: boolean = false,
    @Query('isPublished') isStar: boolean = false,
    @Request() req
  ) {
    const { username } = req.user

    const list = await this.questionService.findAllList({
      keyword,
      page,
      pageSize,
      isDeleted,
      isStar,
      author: username,
    })

    const count = await this.questionService.count({
      keyword,
      isDeleted,
      isStar,
      author: username,
    })

    return {
      list,
      count,
    }
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id)
  }
  @Post()
  create(@Request() req) {
    const { username } = req.user
    return this.questionService.create(username)
  }
  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() questionDto: QuestionDto,
    @Request() req
  ) {
    const { username } = req.user
    this.questionService.update(id, username, questionDto)
    return {}
  }
  @Delete(':id')
  deleteOne(@Param('id') id: string, @Request() req) {
    const { username } = req.user
    return this.questionService.delete(id, username)
  }
  @Delete()
  deleteMany(@Body() body, @Request() req) {
    const { username } = req.user
    const { ids = [] } = body
    return this.questionService.deleteMany(ids, username)
  }
}
