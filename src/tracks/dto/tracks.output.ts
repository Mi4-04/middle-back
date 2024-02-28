import { Field, ObjectType } from '@nestjs/graphql';
import TrackModel from 'src/dto/track.model';
import { Track } from 'src/entities/track.entity';

@ObjectType({ isAbstract: true })
export default class TracksOutput {
  @Field(() => [TrackModel])
  tracks: Track[];
}
