import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { CreateLocationDto } from '../dto/create-location.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ResponseInterceptor } from '../../utils/interceptors/response.interceptor';

@Controller('location')
@UseGuards(AuthGuard)
@UseInterceptors(ResponseInterceptor)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  public async create(@Request() req, @Body() createLocationDto: CreateLocationDto) {
    const authUser = req.authUser;

    return this.locationService.create(createLocationDto, authUser.userId);
  }

  @Get()
  findAll(@Request() req) {
    const authUser = req.authUser;
    return this.locationService.findAllByUserId(authUser.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    // TODO check if the passed parameter is the user's location not someone else's
    return this.locationService.remove(+id);
  }
}
