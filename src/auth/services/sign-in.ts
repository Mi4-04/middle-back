import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import CurrentUserOutput from 'src/dto/current-user.output'
import { User } from 'src/entities/user.entity'
import { IncorrectPasswordError, UserNotFoundError } from 'src/shared/errors'
import { Context, tokenSetter } from 'src/shared/utils/token-handler'
import { Repository } from 'typeorm'
import AuthInput from '../dto/auth.input'
import { compare } from 'bcrypt'

@Injectable()
export default class SignInService {
  private logger = new Logger(SignInService.name)
  constructor(
    @InjectRepository(User)
    private readonly userRepositroy: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  private readonly userAuthTokenKey = this.configService.get('USER_AUTH_TOKEN_KEY')

  async process(input: AuthInput, context: Context): Promise<CurrentUserOutput> {
    try {
      const { email, password } = input

      const user = await this.userRepositroy.findOne({ where: { email } })
      if (user == null) throw new UserNotFoundError('User not found')

      if (!(await compare(password, user.password))) throw new IncorrectPasswordError('Incorrect password')

      const payload = { id: user.id, email: user.email }
      tokenSetter(context, this.userAuthTokenKey, this.jwtService.sign(payload))

      return { currentUser: user }
    } catch (err) {
      this.logger.error(`Server error: `, err)
      throw err
    }
  }

  async signOut(context: Context): Promise<CurrentUserOutput> {
    tokenSetter(context, this.userAuthTokenKey, '')
    return { currentUser: undefined }
  }
}
