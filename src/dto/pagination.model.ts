import { Field, InputType, Int } from '@nestjs/graphql'

@InputType({ isAbstract: true })
export default class PaginationModel {
  @Field(() => Int)
  limit: number

  @Field(() => Int)
  offset: number
}
