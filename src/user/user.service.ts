import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  public constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  /**
   * Creates a user
   * @param createUserDto user data
   * @returns Promise<User>
   */
  public async create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  /**
   * Gets a user by ID
   * @param id user's id
   * @returns Promise<User>
   */
  public async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * Gets a user by email
   * @param email user's email
   * @returns Promise<User>
   */
  public async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * Gets a user by username
   * @param username user's username
   * @returns Promise<User>
   */
  public async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }
}
