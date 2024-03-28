import { NestFactory } from '@nestjs/core'
import InitializationDefaultPlaylistsService from '../module/initilization-default-playlists/services/initialization-default-playlists'
import { ScriptsModule } from '../scripts.module'

async function initializationDefaultPlaylists(): Promise<void> {
  const context = await NestFactory.createApplicationContext(ScriptsModule)
  const initializationDefaultPlaylistsService = context.get(InitializationDefaultPlaylistsService)
  await initializationDefaultPlaylistsService.process()
  process.exit()
}

void initializationDefaultPlaylists()
