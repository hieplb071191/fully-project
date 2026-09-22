import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user-public.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserAdminController } from './controllers/user-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserService],
  controllers: [UserController, UserAdminController],
  exports: [UserService],
})
export class UsersModule {}
