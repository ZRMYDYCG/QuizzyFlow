import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Patch,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { QuestionDto } from './dto/question.dto'

@Controller('question')
export class QuestionController {
  @Get('test')
  test() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
  }
  @Get()
  findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') size: number
  ) {
    console.log(keyword, page, size)
    return {}
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id)
    return {}
  }
  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    console.log(id, questionDto)
    return {}
  }
}
