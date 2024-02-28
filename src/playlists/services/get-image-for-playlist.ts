import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class GetImageForPlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) {}

  async process(id: string): Promise<string | null> {
    const foundPlaylist = await this.playlistRepository.findOne({
      where: { id },
      relations: ['tracks'],
    });

    if (foundPlaylist == null || foundPlaylist.tracks.length === 0) return null;

    return foundPlaylist.tracks[0].imageUrl;
  }
}
