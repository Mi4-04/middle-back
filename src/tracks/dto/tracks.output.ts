import { Field, ObjectType } from '@nestjs/graphql'
import ListOutput from 'src/dto/list.output'
import TrackModel from 'src/dto/track.model'
import { Track } from 'src/entities/track.entity'

@ObjectType({ isAbstract: true })
export default class TracksOutput extends ListOutput {
  @Field(() => [TrackModel])
  tracks: Track[]
}
