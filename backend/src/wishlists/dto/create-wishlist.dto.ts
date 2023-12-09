import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  IsOptional,
  Length,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({ description: 'The name of the wishlist' })
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({ description: 'The description of the wishlist' })
  @IsString()
  @Length(0, 1500)
  description: string;

  @ApiProperty({ description: 'The image URL for the wishlist' })
  @IsUrl()
  image: string;

  @ApiProperty({ description: 'The ID of the User who owns the wishlist' })
  @IsInt()
  @Min(1)
  ownerId: number;

  @ApiPropertyOptional({
    description: 'An array of IDs of Wish items included in the wishlist',
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  itemIds?: number[] = [];
}
