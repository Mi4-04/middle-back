import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export default class StatusOutput {
  @Field()
  status: string;
}
