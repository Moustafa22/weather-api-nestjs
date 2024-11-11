import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { ResponseInterceptor } from '../../utils/interceptors/response.interceptor';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockAuthUser = { userId: '123' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.authUser = mockAuthUser;
          return true;
        }),
      })
      .overrideInterceptor(ResponseInterceptor)
      .useValue({
        intercept: jest.fn((_, next) => next.handle()),
      })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the user profile without sensitive information', async () => {
      const mockUser = {
        id: '123',
        name: 'John Doe',
        hideSensitives: jest.fn(),
      };

      mockUserService.findOne.mockResolvedValue(mockUser);

      const req = { authUser: mockAuthUser };
      const result = await controller.findOne(req as any);

      expect(userService.findOne).toHaveBeenCalledWith('123');
      expect(mockUser.hideSensitives).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});
