import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PAGINATION } from 'src/contants';
import { Track } from 'src/entities/track.entity';
import { Repository } from 'typeorm';
import GetTracksByPlaylistInput from '../dto/get-tracks-by-playlist.input';
import TracksOutput from '../dto/tracks.output';

@Injectable()
export default class TrackCrudService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async getTracksByPlaylist(
    query: GetTracksByPlaylistInput,
  ): Promise<TracksOutput> {
    const { playlistId, pagination = DEFAULT_PAGINATION } = query;
    const { limit, offset } = pagination;

    const tracks = await this.trackRepository
      .createQueryBuilder('tracks')
      .leftJoin('tracks.playlists', 'playlists')
      .andWhere('playlists.id = :playlistId', { playlistId })
      .skip(offset)
      .take(limit)
      .orderBy('tracks.createdAt', 'DESC')
      .getMany();

    return { tracks };
  }
}
