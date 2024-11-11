import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from '../dto/create-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { CreateLocationInput } from '../dto/create-location.input';

@Injectable()
export class LocationService {
  public constructor(@InjectRepository(Location) private locationRepository: Repository<Location>) {}

  // overloads (For Rest APIs and GraphQl)
  public async create(createLocationDto: CreateLocationInput, userId: number): Promise<Location>;
  public async create(createLocationDto: CreateLocationDto, userId: number): Promise<Location>;

  // implementation
  public async create(createLocationDto: CreateLocationDto | CreateLocationInput, userId: number): Promise<Location> {
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
      relations: {
        user: true,
      },
    });
  }

  public async remove(id: number) {
    this.locationRepository.delete(id);
  }

  public async findAll() {
    return this.locationRepository.find();
  }
}
