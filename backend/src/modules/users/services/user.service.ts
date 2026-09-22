import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SignUpDto } from '../../auth/dto/sign-up.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public findOneByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: [
        {
          email: email,
        },
        {
          username: username,
        },
      ],
    });
  }

  public findOne(query: Record<string, unknown>) {
    return this.userRepository.findOne({
      where: query,
      relations: {
        roles: true,
      },
    });
  }

  public saveUser(dto: Partial<SignUpDto & { passwordHash: string }>) {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }
}
