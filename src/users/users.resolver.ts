import { Query, Resolver } from '@nestjs/graphql';
import UserModel from 'src/dto/user.model';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import CurrentUserService from './services/current-user';

@Resolver()
export default class UsersResolver {
  constructor(private readonly currentUserService: CurrentUserService) {}

  @Query(() => UserModel)
  async currentUser(@CurrentUser() { id }: User): Promise<User> {
    return this.currentUserService.process(id);
  }
}
