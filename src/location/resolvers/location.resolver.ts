// location/resolvers/location.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LocationService } from '../services/location.service';
import { CreateLocationInput } from '../dto/create-location.input';
import { LocationType } from '../entities/location.type';
import { ForbiddenException, NotFoundException, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { GqlCurrentUser } from '../../utils/decorator/current-user.decorator.gql';
import { GqlAuthGuard } from 'src/auth/guards/auth.guard.gql';

@Resolver(() => LocationType)
@UseGuards(GqlAuthGuard)
@SkipThrottle()
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  // Query to get all favorite locations
  @Query(() => [LocationType])
  public async locations(@GqlCurrentUser() user) {
    return this.locationService.findAllByUserId(user.userId);
  }

  // Mutation to add a new location
  @Mutation(() => LocationType)
  public async addLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput, @GqlCurrentUser() user) {
    return this.locationService.create(createLocationInput, user.userId);
  }

  // Mutation to remove a location by ID
  @Mutation(() => Boolean)
  public async removeLocation(@Args('id', { type: () => Int }) id: number, @GqlCurrentUser() user) {
    const location = await this.locationService.findOne(+id);
    if (!location) throw new NotFoundException('Not Found');
    if (user.userId !== location.user.id) throw new ForbiddenException('Forbidden Action');

    await this.locationService.remove(id);
    return true;
  }
}
