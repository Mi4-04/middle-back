import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from 'src/entities/user.entity'
import { USER_PASSPORT_STRATEGY_NAME } from 'src/shared/contants'
import { AuthTokenError } from 'src/shared/errors'
import { AuthTokenPayload } from 'src/shared/types'
import { cookieExtractor } from 'src/shared/utils/cookie-extractor'
import { Repository } from 'typeorm'

@Injectable()
export class JwtStratagy extends PassportStrategy(Strategy, USER_PASSPORT_STRATEGY_NAME) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    public readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate(payload: AuthTokenPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.id }
    })

    if (user == null) throw new AuthTokenError('Invalid payload')
    return user
  }
}
