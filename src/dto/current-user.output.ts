import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';
import UserModel from './user.model';

@ObjectType({ isAbstract: true })
export default class CurrentUserOutput {
  @Field(() => UserModel, { nullable: true })
  currentUser?: User;
}
