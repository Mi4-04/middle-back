import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { Response } from 'express';
import { BaseException } from './shared/errors';

@Catch(HttpException)
export class GlobalExceptionFilter implements GqlExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception.key != null) {
      response.status(500).json({
        key: exception.key,
        statusCode: 500,
        message: exception.message,
        payload: exception.payload,
      });
    }
    throw exception;
  }
}
