import { Field, ObjectType } from '@nestjs/graphql';
import PlaylistModel from 'src/dto/playlist.model';
import { Playlist } from 'src/entities/playlist.entity';

@ObjectType({ isAbstract: true })
export default class PlaylistsOutput {
  @Field(() => [PlaylistModel])
  playlists: Playlist[];
}
