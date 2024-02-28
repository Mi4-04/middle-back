import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import PlaylistModel from 'src/dto/playlist.model';
import { Playlist } from 'src/entities/playlist.entity';
import PlaylistsOutput from './dto/playlists.output';
import GetImageForPlaylistService from './services/get-image-for-playlist';
import PlaylistCrudService from './services/playlist-crud';

@Resolver(() => PlaylistModel)
export default class PlaylistsResolver {
  constructor(
    private readonly playlistCrudService: PlaylistCrudService,
    private readonly getImageForPlaylistService: GetImageForPlaylistService,
  ) {}

  @Query(() => PlaylistsOutput)
  async getDefaultPlaylists(): Promise<PlaylistsOutput> {
    return this.playlistCrudService.getDefaultPlaylists();
  }

  @ResolveField(() => String, { nullable: true })
  async imageUrl(@Parent() { id }: Playlist): Promise<string | null> {
    return this.getImageForPlaylistService.process(id);
  }
}
