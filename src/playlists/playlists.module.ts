import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Playlist } from 'src/entities/playlist.entity'
import { Track } from 'src/entities/track.entity'
import { User } from 'src/entities/user.entity'
import PlaylistsResolver from './playlists.resolver'
import GetImageForPlaylistService from './services/get-image-for-playlist'
import PlaylistCrudService from './services/playlist-crud'

@Module({
  imports: [TypeOrmModule.forFeature([User, Playlist, Track])],
  providers: [GetImageForPlaylistService, PlaylistCrudService, PlaylistsResolver]
})
export class PlaylistsModule {}
