import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('User', { isAbstract: true })
export default class UserModel {
  @Field()
  id: string;

  @Field()
  email: string;
}
