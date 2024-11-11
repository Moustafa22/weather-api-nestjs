import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateLocationDto } from '../dto/create-location.dto';

describe('LocationService', () => {
  let locationService: LocationService;
  let locationRepository: Repository<Location>;

  const mockLocationRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    locationService = module.get<LocationService>(LocationService);
    locationRepository = module.get<Repository<Location>>(getRepositoryToken(Location));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should save a new location with userId', async () => {
      const createLocationDto: CreateLocationDto = { city: 'Test Location' };
      const userId = 1;
      const savedLocation = { id: 1, ...createLocationDto, user: { id: userId } };

      mockLocationRepository.save.mockResolvedValue(savedLocation);

      const result = await locationService.create(createLocationDto, userId);

      expect(locationRepository.save).toHaveBeenCalledWith({
        ...createLocationDto,
        user: { id: userId },
      });
      expect(result).toEqual(savedLocation);
    });
  });

  describe('findAllByUserId', () => {
    it('should find all locations for a given userId', async () => {
      const userId = 1;
      const locations = [
        { id: 1, city: 'Location 1', user: { id: userId } },
        { id: 2, city: 'Location 2', user: { id: userId } },
      ];

      mockLocationRepository.find.mockResolvedValue(locations);

      const result = await locationService.findAllByUserId(userId);

      expect(locationRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(result).toEqual(locations);
    });
  });

  describe('findOne', () => {
    it('should find one location by id', async () => {
      const locationId = 1;
      const location = { id: locationId, city: 'Location 1' };

      mockLocationRepository.findOne.mockResolvedValue(location);

      const result = await locationService.findOne(locationId);

      expect(locationRepository.findOne).toHaveBeenCalledWith({
        where: { id: locationId },
        relations: {
          user: true,
        },
      });
      expect(result).toEqual(location);
    });
  });

  describe('remove', () => {
    it('should delete a location by id', async () => {
      const locationId = 1;

      mockLocationRepository.delete.mockResolvedValue({ affected: 1 });

      await locationService.remove(locationId);

      expect(locationRepository.delete).toHaveBeenCalledWith(locationId);
    });
  });
});
