import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateRoleDto } from '../../auth/dto/create-role.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('user-admin')
@Controller('admin')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post('role')
  createRole(@Body() body: CreateRoleDto) {
    return this.userService.createRole(body.roleName);
  }
}
