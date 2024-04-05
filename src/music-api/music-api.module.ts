import { Global, Module } from '@nestjs/common'
import MusicAPIService from './services/music-api'

@Global()
@Module({ providers: [MusicAPIService], exports: [MusicAPIService] })
export class MusicAPIModule {}
