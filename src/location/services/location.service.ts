import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from '../dto/create-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationService {
  public constructor(@InjectRepository(Location) private locationRepository: Repository<Location>) {}

  public async create(createLocationDto: CreateLocationDto, userId: number) {
    return this.locationRepository.save({
      ...createLocationDto,
      user: {
        id: userId,
      },
    });
  }

  public async findAllByUserId(userId: number) {
    return this.locationRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  public async findOne(id: number) {
    return this.locationRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async remove(id: number) {
    this.locationRepository.delete(id);
  }
}
