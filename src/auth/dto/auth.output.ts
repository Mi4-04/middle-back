import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType({ isAbstract: true })
export default class AuthOutput {
  @Field()
  token: string
}
