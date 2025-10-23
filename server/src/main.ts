import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
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
  await app.listen(8080)
}
bootstrap()
