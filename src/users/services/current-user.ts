import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserNotFoundError } from 'src/shared/errors';
import { Repository } from 'typeorm';

@Injectable()
export default class CurrentUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async process(id: string): Promise<User> {
    const currentUser = await this.userRepository.findOne({ where: { id } });
    if (currentUser == null) throw new UserNotFoundError('User not found');

    return currentUser;
  }
}
