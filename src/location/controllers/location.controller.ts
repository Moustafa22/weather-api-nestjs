import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { CreateLocationDto } from '../dto/create-location.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ResponseInterceptor } from '../../utils/interceptors/response.interceptor';
import { CurrentUser } from '../../utils/decorator/current-user.decorator';

@Controller('location')
@UseGuards(AuthGuard)
@UseInterceptors(ResponseInterceptor)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  public async create(@Body() createLocationDto: CreateLocationDto, @CurrentUser() user) {
    return this.locationService.create(createLocationDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user) {
    return this.locationService.findAllByUserId(user.userId);
  }

  @Delete(':id')
  public async remove(@CurrentUser() user, @Param('id') id: string) {
    const location = await this.locationService.findOne(+id);
    if (!location) throw new NotFoundException('Not Found');
    if (user.userId !== location.user.id) throw new ForbiddenException('Forbidden Action');

    return this.locationService.remove(+id);
  }
}
