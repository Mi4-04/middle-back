import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import AuthResolver from './auth.resolver'
import { JwtStratagy } from './jwt-stratagy'
import SignInService from './services/sign-in'
import SignUpService from './services/sign-up'

const configService = new ConfigService()

@Module({
  imports: [
    JwtModule.register({
      secret: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: '7 days' }
    }),
    PassportModule,
    TypeOrmModule.forFeature([User])
  ],
  providers: [SignUpService, SignInService, AuthResolver, JwtStratagy]
})
export class AuthModule {}
