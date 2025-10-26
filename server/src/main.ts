import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  
  // 配置静态文件服务（用于头像访问）
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  })
  
  // 路由全局前缀
  app.setGlobalPrefix('/api')
  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe())
  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor())
  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  // 允许跨域
  app.enableCors()

  // 配置 Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('QuizzyFlow API')
    .setDescription('QuizzyFlow 问卷系统 API 文档')
    .setVersion('1.0')
    .addTag('认证', '用户认证相关接口')
    .addTag('用户', '用户管理相关接口')
    .addTag('问卷', '问卷管理相关接口')
    .addBearerAuth({
      type: 'http',
      description: '基于 JWT 的认证',
      name: 'Authorization',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-doc', app, document)

  await app.listen(8080)
}
bootstrap()
