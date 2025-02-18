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