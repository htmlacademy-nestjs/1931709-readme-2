import { BlogUserMemoryRepository } from './blog-user-memory.repository';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as dayjs from 'dayjs';
import { BlogUserEntity } from './blog-user.entity';

@Injectable()
export class BlogUserService {
  constructor(
    private readonly blogUserMemoryRepository: BlogUserMemoryRepository
  ) {}

  async findByEmail(email: string) {
    const existUser = await this.blogUserMemoryRepository.findByEmail(email);

    if (!existUser) {
      throw new Error('User not found');
    }

    return { ...existUser };
  }

  async register(dto: CreateUserDto) {
    const { email, firstname, lastname, password, dateRegister } = dto;
    const blogUser = {
      _id: '',
      email, 
      firstname, 
      lastname, 
      passwordHash: '', 
      avatar: '', 
      dateRegister: dayjs(dateRegister).toDate(), 
      subscribers: 0, 
      posts: 0
    }

    const existUser = await this.blogUserMemoryRepository.findByEmail(email);

    if (existUser) {
      throw new Error('User already exists')
    }

    const userEntity = await new BlogUserEntity(blogUser).setPassword(password);
    return this.blogUserMemoryRepository.create(userEntity);
  }
}
