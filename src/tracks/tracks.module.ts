import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from 'src/entities/track.entity';
import TrackCrudService from './services/track-crud';
import TracksResolver from './tracks.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  providers: [TrackCrudService, TracksResolver],
})
export class TracksModule {}
