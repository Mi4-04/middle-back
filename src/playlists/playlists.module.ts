import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlist.entity';
import { User } from 'src/entities/user.entity';
import PlaylistsResolver from './playlists.resolver';
import GetImageForPlaylistService from './services/get-image-for-playlist';
import PlaylistCrudService from './services/playlist-crud';

@Module({
  imports: [TypeOrmModule.forFeature([User, Playlist])],
  providers: [
    GetImageForPlaylistService,
    PlaylistCrudService,
    PlaylistsResolver,
  ],
})
export class PlaylistsModule {}
