import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import ormconfig from 'ormconfig'
import { ENV_SCHEMA } from 'src/env-schema'
import { GlobalExceptionFilter } from 'src/global-exeption-filter'
import { InitializationDefaultPlaylistsModule } from './module/initilization-default-playlists/initialization-default-playlists.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ENV_SCHEMA,
      isGlobal: true
    }),
    TypeOrmModule.forRoot(ormconfig),
    InitializationDefaultPlaylistsModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    }
  ]
})
export class ScriptsModule {}
