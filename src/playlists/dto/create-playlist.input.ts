import { Field, InputType } from '@nestjs/graphql'

@InputType({ isAbstract: true })
export default class CreatePlaylistInput {
  @Field()
  name: string
}
