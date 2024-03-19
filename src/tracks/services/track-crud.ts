import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Track } from 'src/entities/track.entity'
import { Repository } from 'typeorm'
import GetTracksByPlaylistInput from '../dto/get-tracks-by-playlist.input'
import TracksOutput from '../dto/tracks.output'
import { ConfigService } from '@nestjs/config'
import PaginationModel from 'src/dto/pagination.model'
import axios from 'axios'
import { stringify } from 'qs'

type TrackItem = {
  id: string
  name: string
  artist_name: string
  audio: string
  image: string
}

type ResultTracks = {
  results: TrackItem[]
}

@Injectable()
export default class TrackCrudService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    private readonly configService: ConfigService
  ) {}

  private readonly clientId = this.configService.get('CLIENT_ID') as string
  private readonly baseAPIUrl = this.configService.get('BASE_MUSIC_API_URL') as string
  private readonly formatResponse = 'json'

  async getTracks(query: GetTracksByPlaylistInput, userId?: string): Promise<TracksOutput> {
    const { playlistId, pagination = { limit: 25, offset: 0 }, search } = query
    const { offset } = pagination

    let externalTracks: Track[] = []
    let externalTracksCount: number = 0
    if (playlistId == null) {
      const { tracks: tracksFromAPI, count: tracksFromAPICount } = await this.getTracksFromAPI(pagination, search)
      externalTracks = [...tracksFromAPI]
      externalTracksCount = tracksFromAPICount
    }

    if (externalTracksCount === 0) pagination.limit = 50

    if (userId != null) {
      const queryBuilder = this.trackRepository
        .createQueryBuilder('tracks')
        .leftJoin('tracks.playlists', 'playlists')
        .andWhere('(playlists.userId = :userId OR playlists.userId IS NULL)', { userId })

      if (playlistId != null) queryBuilder.andWhere('playlists.id = :playlistId', { playlistId })

      if (search != null && search !== '')
        queryBuilder.andWhere('(tracks.name ILIKE :search OR tracks.artist ILIKE :search)', { search: `%${search}%` })

      const [tracks, count] = await queryBuilder
        .skip(offset)
        .take(pagination.limit)
        .orderBy('tracks.createdAt', 'DESC')
        .getManyAndCount()

      return { tracks: [...tracks, ...externalTracks], count: count + externalTracksCount }
    }

    if (playlistId != null && userId == null) {
      const queryBuilder = this.trackRepository
        .createQueryBuilder('tracks')
        .leftJoin('tracks.playlists', 'playlists')
        .andWhere('playlists.id = :playlistId', { playlistId })
        .andWhere('playlists.userId IS NULL')

      if (search != null && search !== '')
        queryBuilder.andWhere('(tracks.name ILIKE :search OR tracks.artist ILIKE :search)', { search: `%${search}%` })

      const [tracks, count] = await queryBuilder
        .skip(offset)
        .take(pagination.limit)
        .orderBy('tracks.createdAt', 'DESC')
        .getManyAndCount()

      return { tracks, count }
    }

    return { tracks: externalTracks, count: externalTracksCount }
  }

  private async getTracksFromAPI(pagiantion: PaginationModel, search?: string): Promise<TracksOutput> {
    const { limit, offset } = pagiantion

    const baseParams = { client_id: this.clientId, format: this.formatResponse, limit, offset }
    const params = { ...baseParams, search }

    const serializedParams = stringify(params, { skipNulls: true })
    const { data }: { data: ResultTracks } = await axios.get(`${this.baseAPIUrl}/tracks/?${serializedParams}`)

    const tracks = data.results.map(({ id, artist_name, name, audio, image }) => {
      return new Track({ realId: id, name, artist: artist_name, audioUrl: audio, imageUrl: image })
    })

    return { tracks, count: tracks.length }
  }
}
