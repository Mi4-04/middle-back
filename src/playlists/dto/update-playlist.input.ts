import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'
import TrackInput from 'src/dto/track.input'
import { Track } from 'src/entities/track.entity'

@InputType({ isAbstract: true })
export default class UpdatePlaylistInput {
  @Field()
  @IsNotEmpty()
  playlistId: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  trackId?: string

  @Field(() => TrackInput, { nullable: true })
  @IsOptional()
  track?: Track
}
