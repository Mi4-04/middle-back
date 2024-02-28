import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import PaginationModel from 'src/dto/pagination.model';

@InputType({ isAbstract: true })
export default class GetTracksByPlaylistInput {
  @Field()
  @IsNotEmpty()
  playlistId: string;

  @Field(() => PaginationModel, { nullable: true })
  @IsOptional()
  pagination?: PaginationModel;
}
