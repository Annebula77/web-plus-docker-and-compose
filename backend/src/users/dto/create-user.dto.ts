import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsOptional, IsUrl } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username',
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiPropertyOptional({
    description: 'About the User',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @Length(2, 200)
  @IsOptional()
  about?: string = 'Пока еще не рассказал ничего о себе';

  @ApiPropertyOptional({ description: 'Avatar URL' })
  @IsUrl()
  @IsOptional()
  avatar?: string = 'https://i.pravatar.cc/300';

  @ApiProperty({ description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  password: string;
}
