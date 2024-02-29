import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import PlaylistModel from 'src/dto/playlist.model'
import StatusOutput from 'src/dto/status.output'
import { Playlist } from 'src/entities/playlist.entity'
import { User } from 'src/entities/user.entity'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/shared/guards/gql-auth-guard'
import UpdatePlaylistInput from './dto/update-playlist.input'
import CreatePlaylistInput from './dto/create-playlist.input'
import PlaylistsOutput from './dto/playlists.output'
import GetImageForPlaylistService from './services/get-image-for-playlist'
import PlaylistCrudService from './services/playlist-crud'

@Resolver(() => PlaylistModel)
export default class PlaylistsResolver {
  constructor(
    private readonly playlistCrudService: PlaylistCrudService,
    private readonly getImageForPlaylistService: GetImageForPlaylistService
  ) {}

  @Query(() => PlaylistsOutput)
  async getDefaultPlaylists(): Promise<PlaylistsOutput> {
    return this.playlistCrudService.getDefaultPlaylists()
  }

  @UseGuards(GqlAuthGuard)
  async createPlaylist(
    @CurrentUser() { id }: User,
    @Args('input') input: CreatePlaylistInput
  ): Promise<PlaylistsOutput> {
    return this.playlistCrudService.createPlaylis(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => StatusOutput)
  async updatePlaylist(@CurrentUser() { id }: User, @Args('input') input: UpdatePlaylistInput): Promise<StatusOutput> {
    return this.playlistCrudService.updatePlaylist(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PlaylistsOutput)
  async getPlaylists(
    @CurrentUser() { id }: User,
    @Args('trackId', { nullable: true }) trackId?: string
  ): Promise<PlaylistsOutput> {
    return this.playlistCrudService.getPlaylists(id, trackId)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PlaylistsOutput)
  async deletePlaylist(@Args('id') id: string, @CurrentUser() { id: userId }: User): Promise<PlaylistsOutput> {
    return this.playlistCrudService.deletePlaylist(id, userId)
  }

  @ResolveField(() => String, { nullable: true })
  async imageUrl(@Parent() { id }: Playlist): Promise<string | null> {
    return this.getImageForPlaylistService.process(id)
  }
}
