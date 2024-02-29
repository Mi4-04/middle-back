import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('Track', { isAbstract: true })
export default class TrackModel {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field()
  trackId: string

  @Field()
  name: string

  @Field(() => String, { nullable: true })
  artist?: string | null

  @Field(() => String, { nullable: true })
  imageUrl?: string | null

  @Field()
  audioUrl: string

  @Field()
  available: boolean
}
