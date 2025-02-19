## 初始化项目

```shell
npm i -g @nestjs/cli
nest new project-name
```

## 基于 interceptor 和 filter 统一路由的数据返回格式

nest g interceptor transform --no-spec

数据的返回格式进行统一

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, map } from 'rxjs'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          error: 0,
          data,
        }
      })
    )
  }
}
```

发生错误时也返回格式统一

nest g filter http-exeption --no-spec

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const message = exception.message ? exception.message : '服务器错误'

    response.status(status).json({
      error: -1,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
```

报错方式:

```ts
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

@Controller('question')
export class QuestionController {
  @Get('test')
  test() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
  }
}
```

这样便会去统一处理异常, 并返回统一的格式

## 使用 nestjs 连结 mongodb 数据库, 并抽离配置信息

安装依赖

```shell
pnpm add @nestjs/mongoose mongoose --save
```

根据官网的引导:

app.module.ts 引入配置, 代码如下:

```typescript
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { QuestionModule } from './question/question.module'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/question'),
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

抽离数据库的配置信息, 下载官方提供的一个插件

```shell
pnpm add @nestjs/config
```

app.module.ts 引入配置, 代码如下:

```typescript
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { QuestionModule } from './question/question.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/question'),
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

创建 .env 文件夹

```shell
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DATABASE=question
```

修改app.module.ts里面的配置

```typescript
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { QuestionModule } from './question/question.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/question'),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`
    ),
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 创建 schema 数据模型, 同步到数据库

question/schemas/question.schema.ts

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type QuestionDocument = HydratedDocument<Question>

@Schema()
export class Question {
    @Prop({ required: true })
    title: string
    @Prop()
    desc: number
    // ...
}
export const QuestionSchema = SchemaFactory.createForClass(Question)
```

question/question.module.ts

```typescript
import { Module } from '@nestjs/common'
import { QuestionController } from './question.controller'
import { QuestionService } from './question.service'
import { MongooseModule } from '@nestjs/mongoose'
import { QuestionSchema, Question } from './schemas/question.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
```

如下就映射好了数据库的 schema 到 mongoose 模型, 并同步到数据库

<img src="https://github.com/user-attachments/assets/76ff6ed2-5b7c-4c7d-b5c0-27b28ab77637" alt="image.png" />


## 使用 service 层操作数据库

question/question.service.ts

依赖注入 Mongoose 模型

完成数据库的增删改查（分页）操作:

```typescript
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Question } from './schemas/question.schema'

@Injectable()
export class QuestionService {
  constructor(
    // 依赖注入
    @InjectModel(Question.name) private readonly questionModel
  ) {}
  async create() {
    const question = new this.questionModel({
      title: 'title',
      desc: 'desc',
    })
    return await question.save()
  }
  async findOne(id: string) {
    return await this.questionModel.findById(id)
  }
}
```

question/question.controller.ts

依赖注入 service 层, 使其获得数据库操作能力

```typescript
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
import { QuestionService } from './question.service'

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
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
    return this.questionService.findOne(id)
  }
  @Post()
  create() {
    return this.questionService.create()
  }
  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    console.log(id, questionDto)
    return {}
  }
}
```

如上便是一个简单的开发模式的示例