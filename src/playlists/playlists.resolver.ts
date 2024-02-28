import { Query, Resolver } from '@nestjs/graphql';
import PlaylistCrudService from './services/playlist-crud';

@Resolver()
export default class PlaylistsResolver {
  constructor(private readonly playlistCrudService: PlaylistCrudService) {}

  @Query(() => String)
  async test(): Promise<string> {
    return 'OK';
  }
}
