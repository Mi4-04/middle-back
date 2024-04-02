import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { IncorrectPasswordError, UserNotFoundError } from 'src/shared/errors'
import { Repository } from 'typeorm'
import AuthInput from '../dto/auth.input'
import { compare } from 'bcrypt'
import AuthOutput from '../dto/auth.output'

@Injectable()
export default class SignInService {
  private logger = new Logger(SignInService.name)
  constructor(
    @InjectRepository(User)
    private readonly userRepositroy: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async process(input: AuthInput): Promise<AuthOutput> {
    try {
      const { email, password } = input

      const user = await this.userRepositroy.findOne({ where: { email } })
      if (user == null) throw new UserNotFoundError('User not found')

      if (!(await compare(password, user.password))) throw new IncorrectPasswordError('Incorrect password')

      const payload = { id: user.id, email: user.email }
      const token = this.jwtService.sign(payload)

      return { token }
    } catch (err) {
      this.logger.error(`Server error: `, err)
      throw err
    }
  }
}
