import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from '../services/location.service';
import { CreateLocationDto } from '../dto/create-location.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ResponseInterceptor } from '../../utils/interceptors/response.interceptor';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('LocationController', () => {
  let locationController: LocationController;
  let locationService: LocationService;

  const mockLocationService = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthUser = {
    userId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock AuthGuard to always return true (auth pass)
      .overrideInterceptor(ResponseInterceptor)
      .useValue({
        intercept: jest.fn((context, next) => next.handle()),
      })
      .compile();

    locationController = module.get<LocationController>(LocationController);
    locationService = module.get<LocationService>(LocationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new location for the authenticated user', async () => {
      const createLocationDto: CreateLocationDto = { city: 'Test Location' };
      const createdLocation = { id: 1, ...createLocationDto, user: { id: mockAuthUser.userId } };

      mockLocationService.create.mockResolvedValue(createdLocation);

      const result = await locationController.create({ authUser: mockAuthUser }, createLocationDto);

      expect(locationService.create).toHaveBeenCalledWith(createLocationDto, mockAuthUser.userId);
      expect(result).toEqual(createdLocation);
    });
  });

  describe('findAll', () => {
    it('should return all locations for the authenticated user', async () => {
      const locations = [
        { id: 1, city: 'Location 1', user: { id: mockAuthUser.userId } },
        { id: 2, city: 'Location 2', user: { id: mockAuthUser.userId } },
      ];

      mockLocationService.findAllByUserId.mockResolvedValue(locations);

      const result = await locationController.findAll({ authUser: mockAuthUser });

      expect(locationService.findAllByUserId).toHaveBeenCalledWith(mockAuthUser.userId);
      expect(result).toEqual(locations);
    });
  });

  describe('remove', () => {
    it('should delete a location by id if it belongs to the authenticated user', async () => {
      const locationId = 1;
      const location = { id: locationId, user: { id: mockAuthUser.userId } };

      mockLocationService.findOne.mockResolvedValue(location);
      mockLocationService.remove.mockResolvedValue({ affected: 1 });

      await locationController.remove({ authUser: mockAuthUser }, locationId.toString());

      expect(locationService.findOne).toHaveBeenCalledWith(locationId);
      expect(locationService.remove).toHaveBeenCalledWith(locationId);
    });

    it('should throw a ForbiddenException if the location does not belong to the authenticated user', async () => {
      const locationId = 1;
      const location = { id: locationId, user: { id: 2 } }; // Location belongs to a different user

      mockLocationService.findOne.mockResolvedValue(location);

      try {
        await locationController.remove({ authUser: mockAuthUser }, locationId.toString());
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('Forbidden Action');
      }
    });

    it('should throw a NotFoundException if the location is not found', async () => {
      const locationId = 1;

      mockLocationService.findOne.mockResolvedValue(null); // Location does not exist

      try {
        await locationController.remove({ authUser: mockAuthUser }, locationId.toString());
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Not Found');
      }
    });
  });
});