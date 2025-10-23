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
    
    const exceptionResponse = exception.getResponse()
    
    let message = '服务器错误'
    
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any
      
      if (Array.isArray(responseObj.message)) {
        message = responseObj.message.join('; ')
      } else if (responseObj.message) {
        message = responseObj.message
      } else if (responseObj.error) {
        message = responseObj.error
      }
    }

    response.status(status).json({
      errno: -1,
      msg: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}