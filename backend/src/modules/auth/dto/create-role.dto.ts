import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'admin',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  roleName: string;
}
