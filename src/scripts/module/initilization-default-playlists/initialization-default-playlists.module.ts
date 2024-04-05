import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Playlist } from 'src/entities/playlist.entity'
import { Track } from 'src/entities/track.entity'
import { MusicAPIModule } from 'src/music-api/music-api.module'
import InitializationDefaultPlaylistsService from './services/initialization-default-playlists'

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Track]), MusicAPIModule],
  providers: [InitializationDefaultPlaylistsService],
  exports: [InitializationDefaultPlaylistsService]
})
export class InitializationDefaultPlaylistsModule {}
