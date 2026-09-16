import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT bearer token to send as `Authorization: Bearer <token>`',
  })
  accessToken!: string;
}
