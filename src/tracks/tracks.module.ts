import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Track } from 'src/entities/track.entity'
import GetTracksService from './services/get-tracks'
import TracksResolver from './tracks.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  providers: [GetTracksService, TracksResolver]
})
export class TracksModule {}
