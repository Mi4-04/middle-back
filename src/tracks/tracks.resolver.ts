import { Args, Query, Resolver } from '@nestjs/graphql';
import GetTracksByPlaylistInput from './dto/get-tracks-by-playlist.input';
import TracksOutput from './dto/tracks.output';
import TrackCrudService from './services/track-crud';

@Resolver()
export default class TracksResolver {
  constructor(private readonly trackCrudService: TrackCrudService) {}

  @Query(() => TracksOutput)
  async getTracksByPlaylist(
    @Args('query') query: GetTracksByPlaylistInput,
  ): Promise<TracksOutput> {
    return this.trackCrudService.getTracksByPlaylist(query);
  }
}
