import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Track } from 'src/entities/track.entity'
import { Repository } from 'typeorm'
import GetTrackListInput from '../dto/get-tracks-list.input'
import TracksOutput from '../dto/tracks.output'
import PaginationModel from 'src/dto/pagination.model'
import MusicAPIService from 'src/music-api/services/music-api'

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
export default class GetTracksService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    private readonly musicAPIService: MusicAPIService
  ) {}

  async getTracks(query: GetTrackListInput, userId?: string): Promise<TracksOutput> {
    const { playlistId, pagination = { limit: 50, offset: 0 }, search } = query
    const { offset, limit } = pagination

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
        .take(limit)
        .orderBy('tracks.createdAt', 'DESC')
        .getManyAndCount()

      return { tracks, count }
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
        .take(limit)
        .orderBy('tracks.createdAt', 'DESC')
        .getManyAndCount()

      return { tracks, count }
    }

    const { tracks: tracksFromAPI, count: countFromAPITracks } = await this.getTracksFromAPI(pagination, search)
    return { tracks: tracksFromAPI, count: countFromAPITracks }
  }

  private async getTracksFromAPI(pagiantion: PaginationModel, search?: string): Promise<TracksOutput> {
    const params = { ...pagiantion, search }
    const data: ResultTracks = await this.musicAPIService.get(`/tracks`, { ...params })

    const tracks = data.results.map(({ id, artist_name, name, audio, image }) => {
      return new Track({ realId: id, name, artist: artist_name, audioUrl: audio, imageUrl: image })
    })

    return { tracks, count: tracks.length }
  }
}
