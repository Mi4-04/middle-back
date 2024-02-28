import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Track', { isAbstract: true })
export default class TrackModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  artist?: string | null;

  @Field(() => String, { nullable: true })
  imageUrl?: string | null;

  @Field()
  audioUrl: string;
}
