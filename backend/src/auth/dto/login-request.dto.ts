import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestUserDto {
  @ApiProperty({
    description: 'The username of the user.',
    maxLength: 64,
    minLength: 1,
  })
  @IsString()
  @Length(1, 64)
  username: string;

  @ApiProperty({
    description: 'The password of the user.',
    minLength: 2,
  })
  @IsString()
  @Length(2)
  password: string;
}
