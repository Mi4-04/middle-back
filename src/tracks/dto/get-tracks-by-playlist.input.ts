import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import PaginationModel from 'src/dto/pagination.model'

@InputType({ isAbstract: true })
export default class GetTracksByPlaylistInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  playlistId?: string

  @Field(() => PaginationModel, { nullable: true })
  @IsOptional()
  pagination?: PaginationModel

  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string
}
