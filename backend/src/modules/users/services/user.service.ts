import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SignUpDto } from '../../auth/dto/sign-up.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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

  public async createRole(roleName: string) {
    const oldRole = await this.roleRepository.findOne({
      where: {
        name: roleName,
      },
    });

    if (oldRole) {
      throw new BadRequestException('Role already exists');
    }

    const role = this.roleRepository.create({
      name: roleName,
    });
    return this.roleRepository.save(role);
  }
}
