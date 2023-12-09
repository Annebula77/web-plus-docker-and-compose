import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'The access token for the authenticated user.',
  })
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
