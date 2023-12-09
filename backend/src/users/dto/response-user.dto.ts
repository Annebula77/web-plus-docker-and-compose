import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Length, IsUrl, IsEmail } from 'class-validator';

export class UserProfileResponseDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'user' })
  @IsString()
  @Length(1, 64)
  username: string;

  @ApiProperty({ example: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(1, 200)
  about: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @ApiProperty({ example: 'user@yandex.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2021-04-12T06:25:43.511Z' })
  @IsString()
  createdAt: string;

  @ApiProperty({ example: '2021-04-12T06:25:43.511Z' })
  @IsString()
  updatedAt: string;
}