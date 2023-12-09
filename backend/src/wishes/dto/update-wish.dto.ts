import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  IsNumber,
  IsOptional,
  Min,
  Length,
} from 'class-validator';

export class UpdateWishDto {
  @ApiPropertyOptional({ description: 'The name of the wish item' })
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The link to the online store for the wish item',
  })
  @IsUrl()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional({ description: 'The image URL of the wish item' })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ description: 'The price of the wish item' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: 'The raised amount for the wish item' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  raised?: number;

  @ApiPropertyOptional({ description: 'The description of the wish item' })
  @IsString()
  @Length(1, 1024)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The number of times the wish item has been copied',
  })
  @IsNumber()
  @IsOptional()
  copied?: number;
}
