import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from 'src/entities/user.entity'
import { AuthTokenError } from 'src/shared/errors'
import { AuthTokenPayload } from 'src/shared/types'
import { Repository } from 'typeorm'

@Injectable()
export class JwtStratagy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    public readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
