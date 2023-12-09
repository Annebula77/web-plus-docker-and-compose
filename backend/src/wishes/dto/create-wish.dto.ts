import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  IsNumber,
  IsOptional,
  Min,
  Length,
} from 'class-validator';

export class CreateWishDto {
  @ApiProperty({ description: 'The name of the wish item' })
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({
    description: 'The link to the online store for the wish item',
  })
  @IsUrl()
  link: string;

  @ApiProperty({ description: 'The image URL of the wish item' })
  @IsUrl()
  image: string;

  @ApiProperty({ description: 'The price of the wish item', default: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'The raised amount for the wish item',
    default: 0,
  })
  @IsNumber()
  @Min(0)
  raised?: number = 0;

  @ApiProperty({ description: 'The ID of the User who owns the wish' })
  ownerId: number;

  @ApiProperty({ description: 'The description of the wish item' })
  @IsString()
  @Length(1, 1024)
  description: string;

  @ApiPropertyOptional({
    description: 'The number of times the wish item has been copied',
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  copied?: number = 0;
}
