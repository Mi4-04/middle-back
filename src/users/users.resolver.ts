import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import UserModel from 'src/dto/user.model'
import { User } from 'src/entities/user.entity'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/shared/guards/gql-auth-guard'
import CurrentUserService from './services/current-user'

@Resolver()
export default class UsersResolver {
  constructor(private readonly currentUserService: CurrentUserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserModel)
  async currentUser(@CurrentUser() user: User): Promise<User> {
    return this.currentUserService.process(user.id)
  }
}
