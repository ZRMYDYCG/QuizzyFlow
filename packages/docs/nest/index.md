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