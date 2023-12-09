import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsOptional, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'username',
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @Length(2, 30)
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    description: 'About the User',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @Length(2, 200)
  @IsOptional()
  about?: string;

  @ApiPropertyOptional({ description: 'Avatar' })
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ description: 'email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'password' })
  @IsString()
  @IsOptional()
  password?: string;
}
