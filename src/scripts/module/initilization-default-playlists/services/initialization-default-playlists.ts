import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import { Playlist } from 'src/entities/playlist.entity'
import { Track } from 'src/entities/track.entity'
import { DataSource, IsNull, Repository } from 'typeorm'

type TrackValue = {
  id: string
  name: string
  artist_name: string
  image: string
  audio: string
}

type PlayListResult = {
  name: string
  tracks: TrackValue[]
}

type PlaylistsResults = {
  results: PlayListResult[]
}

@Injectable()
export default class InitializationDefaultPlaylistsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly configService: ConfigService,
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Track)
    private readonly trackRepositroy: Repository<Track>
  ) {}

  private readonly limit = '150'
  private readonly formatResponse = 'json'
  private readonly clientId = this.configService.get('CLIENT_ID')
  private readonly baseAPIUrl = this.configService.get('BASE_MUSIC_API_URL')

  async process(): Promise<void> {
    const defaultPlaylistNames = [
      'rock',
      'pop',
      'hip-hop',
      'sport',
      'indie',
      'jazz',
      'punk',
      'dance',
      'hardcore',
      'electro',
      'liric'
    ]

    const newPlaylists = new Map<string, Playlist>()

    await Promise.all(
      defaultPlaylistNames.map(async name => {
        const params = {
          client_id: this.clientId,
          format: this.formatResponse,
          name,
          limit: this.limit
        }

        const { data }: { data: PlaylistsResults } = await axios.get(`${this.baseAPIUrl}/playlists/tracks`, { params })

        data.results.forEach(result => {
          const playlistName = result.name.trim().toLowerCase().replace('é', 'e')

          if (!newPlaylists.has(playlistName)) {
            const tracks = result.tracks.map(({ id, artist_name, audio, image, name }) => {
              return new Track({
                realId: id,
                name,
                artist: artist_name,
                imageUrl: image,
                audioUrl: audio
              })
            })
            const playlist = new Playlist({ name: playlistName, tracks })
            newPlaylists.set(playlistName, playlist)
          } else {
            const playlist = newPlaylists.get(playlistName) as Playlist
            const tracks = result.tracks.map(({ id, name, artist_name, audio, image }) => {
              return new Track({
                realId: id,
                name,
                artist: artist_name,
                imageUrl: image,
                audioUrl: audio
              })
            })

            playlist.tracks = [...playlist.tracks, ...tracks]
            newPlaylists.set(playlistName, playlist)
          }
        })
      })
    )

    const playlists = Array.from(newPlaylists.values())

    const removedDefaultPlaylists = await this.playlistRepository.find({
      where: { userId: IsNull() }
    })

    const removedTracksByDefaultPlaylists = await this.trackRepositroy
      .createQueryBuilder('tracks')
      .leftJoin('tracks.playlists', 'playlists')
      .andWhere('playlists.userId IS NULL')
      .getMany()

    await this.dataSource.manager.transaction(async transactionEntityManager => {
      await transactionEntityManager.remove(removedDefaultPlaylists, {
        chunk: 500
      })
      await transactionEntityManager.remove(removedTracksByDefaultPlaylists, {
        chunk: 500
      })
      await this.playlistRepository.save(playlists)
    })
  }
}
