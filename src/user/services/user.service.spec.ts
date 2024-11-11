import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let usersRepository: Repository<User>;

  const mockUser = {
    id: 1,
    firstName: 'firstname',
    lastName: 'lastname',
    email: 'test@example.com',
    username: 'testuser',
    password: 'password',
    hideSensitives: jest.fn(),
  };

  const mockUsersRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save a new user and return it', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'test@example.com',
        lastName: 'test@example.com',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
      };

      mockUsersRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(usersRepository.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@example.com');

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOneByUsername', () => {
    it('should find a user by username', async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByUsername('testuser');

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(result).toEqual(mockUser);
    });
  });
});
