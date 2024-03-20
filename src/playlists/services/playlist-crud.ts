import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import StatusOutput from 'src/dto/status.output'
import { Playlist } from 'src/entities/playlist.entity'
import { Track } from 'src/entities/track.entity'
import { User } from 'src/entities/user.entity'
import { PlaylistNotFoundError, TrackAlreadyExistInPlaylistError, UserNotFoundError } from 'src/shared/errors'
import { ILike, IsNull, Repository } from 'typeorm'
import UpdatePlaylistInput from '../dto/update-playlist.input'
import CreatePlaylistInput from '../dto/create-playlist.input'
import PlaylistsOutput from '../dto/playlists.output'

@Injectable()
export default class PlaylistCrudService {
  private logger = new Logger(PlaylistCrudService.name)
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(User)
    private readonly userRepositroy: Repository<User>
  ) {}

  async getPlaylists(userId: string, trackId?: string): Promise<PlaylistsOutput> {
    const queryBuilder = this.playlistRepository
      .createQueryBuilder('playlists')
      .andWhere('playlists.userId = :userId', { userId })

    if (trackId != null) {
      const subquery = this.playlistRepository
        .createQueryBuilder('subplaylists')
        .innerJoin('subplaylists.tracks', 'subtracks')
        .where('subtracks.id = :trackId', { trackId })
        .select('subplaylists.id')

      queryBuilder.andWhere('playlists.id NOT IN (' + subquery.getQuery() + ')', { trackId })
    }

    const playlists = await queryBuilder.getMany()

    return { playlists }
  }

  async getDefaultPlaylists(): Promise<PlaylistsOutput> {
    const playlists = await this.playlistRepository.find({
      where: { userId: IsNull() }
    })

    return { playlists }
  }

  async createPlaylis(userId: string, input: CreatePlaylistInput): Promise<PlaylistsOutput> {
    const { name } = input

    const foundUser = await this.userRepositroy.findOne({ where: { id: userId } })
    if (foundUser == null) throw new UserNotFoundError('User not found')

    const playlistName = await this.getPlaylistName(name, userId)

    const playlist = new Playlist({ name: playlistName, userId })
    await playlist.save()

    return await this.getPlaylists(userId)
  }

  async updatePlaylist(userId: string, input: UpdatePlaylistInput): Promise<StatusOutput> {
    try {
      const { playlistId, trackId, track } = input
      const { realId, artist, audioUrl, imageUrl, name } = track

      const foundPlaylist = await this.playlistRepository.findOne({
        where: { id: playlistId, userId, tracks: { id: trackId } },
        relations: ['tracks']
      })

      if (foundPlaylist == null) throw new PlaylistNotFoundError('Playlist not found error')

      if (trackId == null) {
        const filteredTracks = foundPlaylist.tracks.filter(track => track.id !== trackId)

        foundPlaylist.tracks = filteredTracks
        await foundPlaylist.save()
      } else {
        const foundTrackInCurrentPlaylist = foundPlaylist.tracks.find(item => item.realId === realId)
        if (foundTrackInCurrentPlaylist != null)
          throw new TrackAlreadyExistInPlaylistError('Track already exist in playlist')

        const foundTrack = await this.trackRepository.findOne({ where: { realId } })

        if (foundTrack == null) {
          const newTrack = new Track({ realId, artist, name, audioUrl, imageUrl })
          await newTrack.save()
          foundPlaylist.tracks = [...foundPlaylist.tracks, newTrack]
          await foundPlaylist.save()
        } else {
          foundPlaylist.tracks = [...foundPlaylist.tracks, foundTrack]
          await foundPlaylist.save()
        }
      }

      return { status: 'Ok' }
    } catch (err) {
      this.logger.error(`Server error: `, err)
      throw err
    }
  }

  async deletePlaylist(id: string, userId: string): Promise<PlaylistsOutput> {
    try {
      const foundPlaylist = await this.playlistRepository.findOne({ where: { id, userId } })
      if (foundPlaylist == null) throw new PlaylistNotFoundError('Playlist not found')

      await this.playlistRepository.remove(foundPlaylist)

      return await this.getPlaylists(userId)
    } catch (err) {
      this.logger.error(`Server error: `, err)
      throw err
    }
  }

  private async getPlaylistName(name: string, userId: string): Promise<string> {
    const foundPlaylistCount = await this.playlistRepository.count({ where: { name: ILike(`${name}%`), userId } })
    if (foundPlaylistCount === 0) return name

    return `${name}(${foundPlaylistCount})`
  }
}
