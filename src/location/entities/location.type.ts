import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LocationType {
  @Field(() => Int)
  id: number;

  @Field()
  city: string;
}
