import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import CurrentUserOutput from 'src/dto/current-user.output'
import { User } from 'src/entities/user.entity'
import { UserAlreadyExistError, UserNotFoundError } from 'src/shared/errors'
import { hashPassword } from 'src/shared/utils/hash-password'
import { Context, tokenSetter } from 'src/shared/utils/token-handler'
import { Repository } from 'typeorm'
import AuthInput from '../dto/auth.input'

@Injectable()
export default class SignUpService {
  private logger = new Logger(SignUpService.name)
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  private readonly userAuthTokenKey = this.configService.get('USER_AUTH_TOKEN_KEY')

  async process(input: AuthInput, context: Context): Promise<CurrentUserOutput> {
    try {
      const { email, password } = input

      const user = new User()
      user.email = email.trim().toLowerCase()
      user.password = await hashPassword(password)

      await this.validate(user)
      const { id } = await user.save()

      const newUser = await this.userRepository.findOne({ where: { id } })
      if (newUser == null) throw new UserNotFoundError('User not found')

      const payload = { id: newUser.id, email: newUser.email }
      tokenSetter(context, this.userAuthTokenKey, this.jwtService.sign(payload))

      return { currentUser: newUser }
    } catch (err) {
      this.logger.error(`Server error: `, err)
      throw err
    }
  }

  private async validate(user: User): Promise<void> {
    const { email } = user

    const foundUser = await this.userRepository.findOne({ where: { email } })
    if (foundUser != null) throw new UserAlreadyExistError('User already exist error')
  }
}
