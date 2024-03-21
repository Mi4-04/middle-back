import { UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import TrackModel from 'src/dto/track.model'
import { Track } from 'src/entities/track.entity'
import { User } from 'src/entities/user.entity'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import { GqlAuthGuard } from 'src/shared/guards/gql-auth-guard'
import GetTrackListInput from './dto/get-tracks-list.input'
import TracksOutput from './dto/tracks.output'
import TrackCrudService from './services/track-crud'

@Resolver(() => TrackModel)
export default class TracksResolver {
  constructor(private readonly trackCrudService: TrackCrudService) {}

  @Query(() => TracksOutput)
  async getTracksForGuest(@Args('query') query: GetTrackListInput): Promise<TracksOutput> {
    return this.trackCrudService.getTracks(query)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => TracksOutput)
  async getTracks(@Args('query') query: GetTrackListInput, @CurrentUser() { id }: User): Promise<TracksOutput> {
    return this.trackCrudService.getTracks(query, id)
  }

  @ResolveField(() => Boolean)
  available(@Parent() { audioUrl }: Track): boolean {
    return audioUrl !== '' ? true : false
  }
}
