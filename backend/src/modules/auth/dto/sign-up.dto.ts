import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty, IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  @ApiProperty({
    description: 'Email',
    type: String,
    required: true,
    example: 'lehiep@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({
    description: 'Password',
    type: String,
    required: true,
    example: 'lehiep',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Display name',
    type: String,
    required: true,
    example: 'lehiep',
  })
  username: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'avatar image url',
    type: String,
    required: false,
    example: 'https://www.istockphoto.com/photos/free-sample',
  })
  avatar: string;
}
