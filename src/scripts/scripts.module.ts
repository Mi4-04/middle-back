import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';
import { ENV_SCHEMA } from 'src/env-schema';
import { InitializationDefaultPlaylistsModule } from './module/initilization-default-playlists/initialization-default-playlists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ENV_SCHEMA,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    InitializationDefaultPlaylistsModule,
  ],
  providers: [],
})
export class ScriptsModule {}
