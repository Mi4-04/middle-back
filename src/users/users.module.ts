import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import CurrentUserService from './services/current-user'
import UsersResolver from './users.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CurrentUserService, UsersResolver]
})
export class UsersModule {}
