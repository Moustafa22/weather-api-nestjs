import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, TokenPayload, AuthResults } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { sign } from 'crypto';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let passwordService: PasswordService;
  let userService: UserService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    hideSensitives: jest.fn(),
  } as unknown as User;

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockPasswordService = {
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
  };

  const mockUserService = {
    findOneByUsername: jest.fn(),
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    passwordService = module.get<PasswordService>(PasswordService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign in a user and return an access token and user info', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password' };

      mockUserService.findOneByUsername.mockResolvedValue(mockUser);
      mockPasswordService.verifyPassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('accessToken');

      const result: AuthResults = await authService.signIn(loginDto);

      expect(userService.findOneByUsername).toHaveBeenCalledWith(loginDto.username);
      expect(passwordService.verifyPassword).toHaveBeenCalledWith(mockUser.password, loginDto.password);
      expect(mockUser.hideSensitives).toHaveBeenCalled();
      expect(result).toEqual({ access_token: 'accessToken', user: mockUser });
    });

    it('should throw an error if the password is incorrect', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'wrongPassword' };

      mockUserService.findOneByUsername.mockResolvedValue(mockUser);
      mockPasswordService.verifyPassword.mockResolvedValue(false);

      await expect(authService.signIn(loginDto)).rejects.toThrow(BadRequestException);
      expect(passwordService.verifyPassword).toHaveBeenCalledWith(mockUser.password, loginDto.password);
    });

    it('should throw an error if the user does not exist', async () => {
      const loginDto: LoginDto = { username: 'nonexistentuser', password: 'password' };

      mockUserService.findOneByUsername.mockResolvedValue(null);

      await expect(authService.signIn(loginDto)).rejects.toThrow(BadRequestException);
      expect(userService.findOneByUsername).toHaveBeenCalledWith(loginDto.username);
    });
  });

  describe('register', () => {
    it('should register a new user and return an access token and user info', async () => {
      const registerDto: RegisterDto = {
        firstName: 'firstname',
        lastName: 'lastname',
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password',
      };

      mockUserService.findOneByUsername.mockResolvedValue(null);
      mockUserService.findOneByEmail.mockResolvedValue(null);
      mockPasswordService.hashPassword.mockResolvedValue('hashedPassword');
      mockUserService.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('accessToken');
      const authResult = { access_token: 'accessToken', user: mockUser };

      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'signIn').mockResolvedValue(authResult);

      const result: AuthResults = await authService.register(registerDto);

      expect(userService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: 'hashedPassword',
      });
      const loginDto: LoginDto = { password: 'password', username: 'newuser' };

      expect(authService.signIn).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ access_token: 'accessToken', user: mockUser });
    });

    it('should throw an error if the username is already taken', async () => {
      const registerDto: RegisterDto = {
        firstName: 'firstname',
        lastName: 'lastname',
        username: 'existinguser',
        email: 'newuser@example.com',
        password: 'password',
      };

      mockUserService.findOneByUsername.mockResolvedValue(mockUser);

      await expect(authService.register(registerDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the email is already taken', async () => {
      const registerDto: RegisterDto = {
        firstName: 'firstname',
        lastName: 'lastname',
        username: 'newuser',
        email: 'existingemail@example.com',
        password: 'password',
      };

      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      await expect(authService.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verify', () => {
    it('should verify a token and return the payload', async () => {
      const token = 'validToken';
      const payload: TokenPayload = {
        sub: 1,
        userId: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      mockJwtService.verifyAsync.mockResolvedValue(payload);

      const result = await authService.verify(token);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, undefined);
      expect(result).toEqual(payload);
    });

    it('should throw an error if the token is invalid', async () => {
      const token = 'invalidToken';

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(authService.verify(token)).rejects.toThrow(Error);
    });
  });
});
