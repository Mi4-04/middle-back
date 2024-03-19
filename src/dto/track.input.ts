import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'

@InputType({ isAbstract: true })
export default class TrackInput {
  @Field()
  @IsNotEmpty()
  realId: string

  @Field()
  @IsNotEmpty()
  name: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  artist?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  imageUrl?: string

  @Field()
  @IsNotEmpty()
  audioUrl: string
}
