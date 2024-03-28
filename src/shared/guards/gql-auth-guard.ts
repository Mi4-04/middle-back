import { Injectable, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { AuthTokenError } from 'src/shared/errors'
import { USER_PASSPORT_STRATEGY_NAME } from '../contants'

@Injectable()
export class GqlAuthGuard extends AuthGuard(USER_PASSPORT_STRATEGY_NAME) {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  handleRequest<User>(err, user, info, context, status): User {
    if (err != null || user === false) {
      throw new AuthTokenError('Invalid payload')
    }
    return user
  }
}
