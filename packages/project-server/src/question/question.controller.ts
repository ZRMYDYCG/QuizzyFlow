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
} from '@nestjs/common'
import { QuestionDto } from './dto/question.dto'
import { QuestionService } from './question.service'

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Get('test')
  test() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
  }
  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number
  ) {
    const list = await this.questionService.findAllList({
      keyword,
      page,
      pageSize,
    })

    const count = await this.questionService.count({ keyword })

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
  create() {
    return this.questionService.create()
  }
  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    this.questionService.update(id, questionDto)
    return {}
  }
  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.questionService.delete(id)
  }
}
