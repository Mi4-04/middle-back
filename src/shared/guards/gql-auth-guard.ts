import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthTokenError } from 'src/shared/errors'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  private readonly jwtSecret = this.configService.get('JWT_SECRET') as string

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext().req
    if (!ctx.headers.authorization) return false

    ctx.user = this.validateToken(ctx.headers.authorization)
    return true
  }

  validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') throw new AuthTokenError('Invalid token')

    const token = auth.split(' ')[1]
    try {
      return jwt.verify(token, this.jwtSecret)
    } catch (err) {
      throw new AuthTokenError('Invalid payload')
    }
  }
}
