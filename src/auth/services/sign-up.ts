import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { UserAlreadyExistError, UserNotFoundError } from 'src/shared/errors'
import { hashPassword } from 'src/shared/utils/hash-password'
import { Repository } from 'typeorm'
import AuthInput from '../dto/auth.input'
import AuthOutput from '../dto/auth.output'

@Injectable()
export default class SignUpService {
  private logger = new Logger(SignUpService.name)
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async process(input: AuthInput): Promise<AuthOutput> {
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
      const token = this.jwtService.sign(payload)

      return { token }
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
