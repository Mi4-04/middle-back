import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType({ isAbstract: true })
export default class ListOutput {
  @Field()
  count: number
}
