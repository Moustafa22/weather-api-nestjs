import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  public constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  public async create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  public async findOne(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }
}
