import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ResponseInterceptor } from '../../utils/interceptors/response.interceptor';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideInterceptor(ResponseInterceptor)
      .useValue({
        intercept: jest.fn((context, next) => next.handle()),
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call authService.signIn with loginDto and return the result', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password' };
      const signInResult = { access_token: 'token', user: { username: 'testuser' } };

      mockAuthService.signIn.mockResolvedValue(signInResult);

      const result = await authController.login(loginDto);

      expect(authService.signIn).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(signInResult);
    });
  });

  describe('register', () => {
    it('should call authService.register with registerDto and return the result', async () => {
      const registerDto: RegisterDto = {
        firstName: 'firstname',
        lastName: 'lastname',
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password',
      };
      const registerResult = { access_token: 'token', user: { username: 'newuser' } };

      mockAuthService.register.mockResolvedValue(registerResult);

      const result = await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(registerResult);
    });
  });
});
