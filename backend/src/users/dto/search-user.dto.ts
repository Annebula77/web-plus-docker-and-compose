import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchUsersDto {
  @ApiProperty({ description: 'Query string for username or email' })
  @IsString()
  query: string;
}
