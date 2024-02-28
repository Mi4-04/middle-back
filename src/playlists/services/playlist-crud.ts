import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlist.entity';
import { IsNull, Repository } from 'typeorm';
import PlaylistsOutput from '../dto/playlists.output';

@Injectable()
export default class PlaylistCrudService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) {}

  async getDefaultPlaylists(): Promise<PlaylistsOutput> {
    const playlists = await this.playlistRepository.find({
      where: { userId: IsNull() },
    });

    return { playlists };
  }
}
