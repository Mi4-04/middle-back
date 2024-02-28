import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { ENV_SCHEMA } from './env-schema';
import { PlaylistsModule } from './playlists/playlists.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ENV_SCHEMA,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
      context: (req) => req,
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    PlaylistsModule,
  ],
})
export class AppModule {}
