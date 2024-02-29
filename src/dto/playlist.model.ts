import { Field, ObjectType } from '@nestjs/graphql'
import TrackModel from './track.model'

@ObjectType('Playlist', { isAbstract: true })
export default class PlaylistModel {
  @Field()
  id: string

  @Field()
  name: string

  @Field(() => String, { nullable: true })
  imageUrl: string | null
}
